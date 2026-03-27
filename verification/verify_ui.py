from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Test Bakery Home
        print("Checking Bakery Home...")
        page.goto("http://localhost:3000")
        page.wait_for_timeout(2000)
        page.screenshot(path="verification/bakery_home.png")

        # Test Restaurant Home
        print("Checking Restaurant Home...")
        page.goto("http://localhost:3001")
        page.wait_for_timeout(2000)
        page.screenshot(path="verification/restaurant_home.png")

        browser.close()

if __name__ == "__main__":
    run()
