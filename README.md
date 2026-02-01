# 💼 Accounting & Invoice Management System

<p align="center"> <img src="screenshots/logo.png" width="150"/> </p>
<p align="center"> A powerful web-based accounting system built with MERN Stack to manage invoices, customers, payments, and checks with full financial accuracy. </p>

## 🖼️ Screenshots

> **Note:** Place screenshots in the `screenshots/` folder.

|                     Dashboard                      |                     Invoice                      |                 Customer Statement                 |
| :------------------------------------------------: | :----------------------------------------------: | :------------------------------------------------: |
| <img src="screenshots/dashboard.png" width="200"/> | <img src="screenshots/invoice.png" width="200"/> | <img src="screenshots/statement.png" width="200"/> |

|                     Payments                     |                     Checks                      |
| :----------------------------------------------: | :---------------------------------------------: |
| <img src="screenshots/payment.png" width="200"/> | <img src="screenshots/checks.png" width="200"/> |

## 🚀 Features

### 🧾 Invoice Management

- Create sales invoices
- Unique invoice code generation
- **Supports:**
  - Cash
  - Check
  - Credit (Debt)
- Automatic customer balance updates

### 💰 Payments

- Register customer payments
- **Supports:**
  - Cash
  - Check
- **Check lifecycle:**
  - Pending
  - Collected
  - Returned
- Returned checks automatically increase customer balance

### 🏦 Check Management

- Checks can be added:
  - From invoices
  - From direct payments
- Full status tracking
- Automatic financial effect on customer account

### 👤 Customer Management

- Store customer details
- **Track:**
  - Total invoices
  - Total payments
  - Balance
- Negative balance = Customer Debt

### 📑 Customer Account Statement (كشف حساب)

- **Shows:**
  - Invoices
  - Payments
  - Checks
- Running balance after each operation
- Accurate final balance
- Printable statement

### 📊 Dashboard

- Total Sales (from invoices)
- Total Debts (from negative balances)
- Total Customers
- Recent Transactions

### 🧠 Business Logic

- ✔ Invoice → increases customer debt
- ✔ Payment → reduces debt
- ✔ Check → reduces debt when collected
- ✔ Returned check → increases debt again
- ✔ Statement always reflects real data
- ✔ Final balance is always correct

## 🛠️ Tech Stack

### Frontend

- React
- Material UI
- Axios
- React Router

### Backend

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication

## 📂 Project Structure

```
/client
   /components
   /pages
   /services
/server
   /models
   /routes
   /controllers
   /services
   /utils
```

## 🗄️ Main Models

- Customer
- Invoice
- Payment
- Check
- Product

## 🖨️ Printing

- Printable invoices
- Printable customer statements

## 📦 Installation

### Backend

```bash
cd server
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm start
```

## ⚙️ Environment Variables

Create `.env` file inside `/server`:

```env
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key
PORT=5000
```

## 📌 Future Improvements

- Monthly & yearly reports
- Export to PDF & Excel
- Profit analysis
- Multi-branch system
- User roles & permissions

## 🧑💻 Author

**Developed by Your Name**

- Computer Engineering Graduate
- Junior+ Backend Developer

## ⭐ Why This Project?

This system reflects real accounting workflows:

- Invoices
- Payments
- Checks lifecycle
- Customer balances

**Ensuring:**

- ✅ Financial accuracy
- ✅ Data integrity
- ✅ Real-world usability

## 📸 How to Add Screenshots

1.  Create folder: `screenshots`
2.  Add images:
    - `dashboard.png`
    - `invoice.png`
    - `payment.png`
    - `statement.png`
    - `checks.png`

GitHub will display them automatically.

## ❤️ Support

If you like this project, give it a ⭐ on GitHub.
It motivates me to build more quality systems 🚀
