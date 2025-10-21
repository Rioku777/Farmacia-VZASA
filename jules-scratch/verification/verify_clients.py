from playwright.sync_api import sync_playwright, expect

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto("http://localhost:3000/")

    # Perform login
    page.get_by_placeholder("Ingrese su usuario").fill("admin")
    page.get_by_placeholder("Ingrese su contraseña").fill("admin123")
    page.get_by_role("button", name="Iniciar Sesión").click()

    # Wait for the dashboard to load by checking for the welcome message
    expect(page.get_by_role("heading", name="Bienvenido de vuelta, admin 👋")).to_be_visible()

    # Navigate to the Clientes/Proveedores page
    page.get_by_role("button", name="Clientes/Proveedores").click()

    # Wait for the "Contactos" header to be visible
    expect(page.get_by_role("heading", name="Contactos")).to_be_visible()

    # Click the "Nuevo Cliente" button
    page.get_by_role("button", name="Nuevo Cliente").click()

    # Wait for the modal to appear
    modal = page.locator(".glass-card h2:has-text('Nuevo Cliente')").locator("..")
    expect(modal).to_be_visible()

    # Fill out the form within the modal
    modal.get_by_placeholder("Nombre *").fill("Test Client")
    modal.get_by_placeholder("Teléfono").fill("123-456-7890")
    modal.get_by_placeholder("Email").fill("test@example.com")
    modal.get_by_placeholder("Dirección").fill("123 Test St")

    # Click the "Guardar" button in the modal
    modal.get_by_role("button", name="Guardar").click()

    # Wait for the success toast to appear and then disappear
    toast = page.locator("[data-radix-toast-root]")
    expect(toast).to_be_visible(timeout=10000)
    expect(toast).to_be_hidden(timeout=10000)

    # Expect the new client to be visible on the page
    expect(page.get_by_text("Test Client")).to_be_visible()

    page.screenshot(path="jules-scratch/verification/verification.png")
    browser.close()

with sync_playwright() as playwright:
    run(playwright)
