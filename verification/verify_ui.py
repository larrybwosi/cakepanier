from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Test Bakery Home
        print("Checking Bakery Home...")
        page.goto("http://localhost:3000")
        page.wait_for_timeout(2000)  # Wait for any animations
        page.screenshot(path="verification/bakery_home.png")

        # Test Bakery Menu
        print("Checking Bakery Menu...")
        page.goto("http://localhost:3000/menu")
        page.wait_for_timeout(2000)
        page.screenshot(path="verification/bakery_menu.png")

        browser.close()

if __name__ == "__main__":
    run()
