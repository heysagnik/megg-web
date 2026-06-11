import requests
import concurrent.futures
import time
import sys

# ==========================================
# CONFIGURATION
# ==========================================
API_BASE_URL = "https://api.megg.workers.dev/api"
CDN_BASE_URL = "https://media.meggfashion.in"
WORKER_PROXY_URL = "https://api.megg.workers.dev/api/optimize"
CONCURRENCY = 20

# Standard sizes used in srcset across the site
WIDTHS = [320, 480, 640, 800, 1080]
QUALITY = 90

import requests

def fetch_free_indian_proxies():
    print("Fetching free Indian proxies from ProxyScrape...")
    url = "https://api.proxyscrape.com/v4/free-proxy-list/get?request=display_proxies&proxy_format=protocolipport&format=text&country=in"
    try:
        res = requests.get(url, timeout=10)
        lines = res.text.strip().split('\n')
        proxies = []
        for line in lines:
            line = line.strip()
            if line:
                # The v4 format returns "protocol://ip:port" directly
                proxies.append({
                    "http": line,
                    "https": line
                })
        # Use top 5 proxies to prevent infinite timeouts
        print(f"-> Found {len(proxies)} Indian proxies (using top 5).")
        return proxies[:5]
    except Exception as e:
        print("-> Failed to fetch proxies:", e)
        return []

INDIAN_PROXIES = fetch_free_indian_proxies()

def get_all_product_images():
    """Fetch all product image URLs from the Megg API."""
    images = set()
    page = 1
    limit = 100
    
    print("Fetching products from API...")
    while True:
        try:
            res = requests.get(f"{API_BASE_URL}/products/list?page={page}&limit={limit}", timeout=15)
            res.raise_for_status()
            data = res.json()
            
            products = data.get("products", [])
            if not products:
                break
            
            for p in products:
                for img in p.get("images", []):
                    # Resolve full URL (based on your image.ts logic)
                    full_url = img
                    if img.startswith('/'):
                        full_url = f"{CDN_BASE_URL}{img}"
                    elif not img.startswith('http'):
                        full_url = f"{CDN_BASE_URL}/{img}"
                    
                    # Generate the Cloudflare Worker Proxy URLs for all standard widths
                    for w in WIDTHS:
                        # URL encode the target url
                        import urllib.parse
                        encoded_url = urllib.parse.quote(full_url, safe='')
                        proxy_url = f"{WORKER_PROXY_URL}?url={encoded_url}&w={w}&q={QUALITY}"
                        images.add(proxy_url)
            
            total_pages = data.get("totalPages", 1)
            print(f"  -> Fetched page {page}/{total_pages} ({len(products)} products)")
            
            if page >= total_pages:
                break
            page += 1
            
        except Exception as e:
            print(f"Error fetching page {page}: {e}")
            break
            
    return list(images)

def warm_url(url, proxy=None):
    """Make a GET request to warm the cache for a specific URL."""
    try:
        # We do a GET request (headers only usually don't trigger full cache writes in CF)
        # Using stream=True and reading a tiny chunk triggers the cache fill without downloading the whole file locally.
        start = time.time()
        res = requests.get(url, proxies=proxy, stream=True, timeout=10)
        
        cf_cache_status = res.headers.get("CF-Cache-Status", "UNKNOWN")
        cf_ray = res.headers.get("CF-RAY", "UNKNOWN")
        
        # Determine which edge location served this request by looking at the CF-RAY suffix (e.g. 'BOM', 'DEL')
        edge_loc = cf_ray.split('-')[-1] if '-' in cf_ray else "UNKNOWN"
        
        elapsed = (time.time() - start) * 1000
        status_code = res.status_code
        
        # Read the first byte to trigger cache
        for _ in res.iter_content(chunk_size=1024):
            break
            
        res.close()
        
        return {
            "url": url, 
            "status": status_code, 
            "cache": cf_cache_status, 
            "edge": edge_loc,
            "ms": int(elapsed)
        }
    except Exception as e:
        return {"url": url, "error": str(e)}

def main():
    print("==================================================")
    print("MEGG PRODUCT IMAGE CACHE WARMER")
    print("==================================================")
    
    images = get_all_product_images()
    print(f"\nFound {len(images)} unique product images to warm.")
    
    if not images:
        print("No images found. Exiting.")
        sys.exit(0)
        
    print(f"\nWarming Cloudflare Image Proxy cache using concurrency = {CONCURRENCY}")
    
    proxy_list = INDIAN_PROXIES if INDIAN_PROXIES else [None]
    total_tasks = len(images) * len(proxy_list)
    completed = 0
    
    print(f"Total optimization requests to make: {total_tasks}\n")
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=CONCURRENCY) as executor:
        futures = []
        for proxy in proxy_list:
            for url in images:
                futures.append(executor.submit(warm_url, url, proxy))
                
        for future in concurrent.futures.as_completed(futures):
            completed += 1
            result = future.result()
            
            if "error" in result:
                print(f"[{completed}/{total_tasks}] ERROR: {result['url'][:80]}... - {result['error']}")
            else:
                # Extract the 'w' param for logging
                w_param = result['url'].split('w=')[1].split('&')[0] if 'w=' in result['url'] else '?'
                print(f"[{completed}/{total_tasks}] HTTP {result['status']} | Cache: {result['cache']:<8} | Edge: {result['edge']:<3} | {result['ms']}ms | Width: {w_param}px")

    print("\n==================================================")
    print("Cloudflare Worker Cache warming complete!")
    print("The heavy image resizing process has been executed and cached at the edge.")
    print("==================================================")

if __name__ == "__main__":
    main()
