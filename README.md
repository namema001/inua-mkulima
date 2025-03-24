Inua Mkulima Agro-Dealers Platform

General Process
User Authentication

Sign-In Flow:

The sign-in landing page is split into two halves on larger screens. The left half displays a full-cover background image, while the right half contains the sign-in form.

Initially, only the username field is visible. After validating the username, the password field appears. This two-step sign-in process ensures that basic input is valid before proceeding.

Token Handling:

Upon successful authentication, an access token is returned from the API.

The token is obfuscated using Base64 encoding combined with a key for basic protection before storing it locally.

This token is then used by an HTTP interceptor to attach authentication headers to subsequent API requests.

Product Management

Product Listing:

The application fetches product data from an API and displays it in a paginated list (10 items per page) on the left side.

Each product displays its title and price along with an “add” button to include it in the cart.

Cart Functionality:

The right side of the screen displays a cart where selected products are listed.

Users can adjust quantities using plus and minus controls. When a product’s quantity reaches zero, it is removed from the cart.

The total deduction is calculated in real time based on the products selected and their quantities.

Transaction Processing

Deduction Flow:

A “Deduct KES X” button is displayed, where X is the total cart amount.

When clicked, an Angular Material modal appears asking for confirmation.

Upon confirmation, the total is deducted from a static wallet balance (KES 100,000), and the cart is cleared.

A success message is displayed, and the user is navigated back to the product listing.

Responsive Design

On large screens, the layout is split into two columns (left with an image and right with the form or content).

On small and medium devices, the sign-in form (or content) appears on top of the background image.

The product and cart pages adapt to screen size, ensuring usability across devices.

Validation & Error Handling

Form Validations:

Username and password fields include validations such as required, minimum/maximum lengths, and allowed character patterns.

Error messages are displayed using Angular Material’s <mat-error> components.

API Errors:

Incorrect credentials and other API errors are handled gracefully, with appropriate messages displayed to the user.

Technology Stack
Angular 17 (with standalone components and signals)

Angular Material UI for responsive, modern design components

SCSS for styling

RxJS for asynchronous operations

TypeScript for type safety

How to Run the Application
Clone the repository.

Run npm install to install all dependencies.

Run ng serve to start the development server.

Open http://localhost:4200 in your web browser.

Note
Important: While the core functionality of the application is complete and fully operational, I did not have enough time to perfect the UI. Some aspects of the visual design might require further refinement if given time to finalize. The current focus was to ensure robust functionality and process flow.
