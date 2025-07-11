/**
 * Convert API form data to Playwright TypeScript test code
 * @param {Object} formData - Object containing API form data
 * @returns {string} - Generated Playwright TypeScript test code
 */
function convertToPlaywright(formData) {
    const { url, method, headers, body } = formData;
    
    // Generate test name based on method and URL
    const urlParts = url.split('/');
    const endpoint = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2] || 'api';
    const testName = `${method.toLowerCase()}_${endpoint}_test`;
    
    // Parse headers and body
    let parsedHeaders = {};
    let parsedBody = {};
    
    try {
        if (headers && headers.trim()) {
            parsedHeaders = JSON.parse(headers);
        }
    } catch (err) {
        throw new Error(`Invalid headers JSON: ${err.message}`);
    }
    
    try {
        if (body && body.trim()) {
            parsedBody = JSON.parse(body);
        }
    } catch (err) {
        throw new Error(`Invalid body JSON: ${err.message}`);
    }
    
    // Generate Playwright test code
    let playwrightCode = `import { test, expect } from '@playwright/test';

// @author: testers talk
// @date: ${new Date().toISOString()}
test('${testName}', async ({ request }) => {
    // Test data
    const url = '${url}';
    const method = '${method}';
    const headers = ${JSON.stringify(parsedHeaders, null, 4)};
    ${body && body.trim() ? `const requestBody = ${JSON.stringify(parsedBody, null, 4)};` : ''}

    // Make API request with headers
    const response = await request.${method.toLowerCase()}(url, {
        ${body && body.trim() ? 'data: requestBody,' : ''}
        headers: headers
    });
    
    // Assertions
    expect(response.status()).toBe(200); // Adjust expected status code as needed
    
    // Parse response body
    const responseBody = await response.json();
    
    // Add specific assertions based on your API response structure
    // Example assertions:
    // expect(responseBody).toHaveProperty('id');
    // expect(responseBody.firstname).toBe('playwright by testers talk');
    // expect(responseBody.lastname).toBe('cypress by testers talk');
    
    // Log response for debugging
    console.log('Response Status:', response.status());
    console.log('Response Body:', responseBody);
    
    // Additional validation
    expect(response.headers()).toHaveProperty('content-type');
    expect(response.headers()['content-type']).toContain('application/json');
});`;

    return playwrightCode;
}

/**
 * Handle form submission and convert to Playwright
 * @param {HTMLFormElement} form - The form element
 */
function handlePlaywrightConversion(form) {
    const url = form.querySelector('[name="apiUrl"]').value.trim();
    const method = form.querySelector('[name="apiMethod"]').value;
    const headers = form.querySelector('[name="apiHeaders"]').value.trim();
    const body = form.querySelector('[name="apiBody"]').value.trim();
    const responseBox = form.querySelector('[name="apiResponse"]');
    
    if (!url) {
        responseBox.value = 'Error: API URL is required';
        return;
    }
    
    try {
        const formData = { url, method, headers, body };
        const playwrightCode = convertToPlaywright(formData);
        responseBox.value = playwrightCode;
    } catch (error) {
        responseBox.value = `Error: ${error.message}`;
    }
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { convertToPlaywright, handlePlaywrightConversion };
} 