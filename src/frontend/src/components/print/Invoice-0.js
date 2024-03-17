import React, { useEffect, useState } from 'react';
import './Invoice.css'; // Create a CSS file for your styles

const Invoice = ({invoiceData}) => {

  const renderInvoiceRows = () => {
    const rows = [];
    
    // Add rows based on the provided data or a minimum of 5 rows
    for (let i = 0; i < Math.max(invoiceData.length, 5); i++) {
      const rowData = invoiceData[i] || { description: '', charges: '' };
      rows.push(
        <tr key={i}>
          <td>{rowData.description}</td>
          <td>{rowData.charges}</td>
        </tr>
      );
    }

    return rows;
  };
useEffect(()=>{

},[invoiceData])
  return (
    <div className="container">
      <div className="header">
        <h1>XYZ</h1>
        <p className="date">Date: 22-01-2024</p>
      </div>
      <div className="divider"></div>
      <table className="invoice-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Charges</th>
          </tr>
        </thead>
        <tbody>
          {renderInvoiceRows()}
          <tr>
            <td>Total Amount</td>
            <td>80.00</td>
          </tr>
         
        </tbody>
      </table>
      <div className="thank-you">
        <p>Thank you. Get well soon!</p>
      </div>
    </div>
  );
}

export default Invoice;
