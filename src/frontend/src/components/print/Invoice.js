import React, { useRef } from "react";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import ReactToPrint from "react-to-print";
// import { useReactToPrint } from 'react-to-print';
// import  {Table}  from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import "../scss/print.css";
import moment from "moment";
import "./Invoice.css";

class Invoice extends React.PureComponent {
  constructor(props) {
    super(props);

    console.log(props);
    this.renderInvoiceRows = this.renderInvoiceRows.bind(this);
    let totalAmount = this.props.invoiceData.reduce(
      (sum, item) => sum + item.amount,
      0
    );
    this.state = {
      totalSum: totalAmount,
    };
  }

  renderInvoiceRows = () => {
    const rows = [];

    // Add rows based on the provided data or a minimum of 5 rows
    for (let i = 0; i < Math.max(this.props.invoiceData.length, 2); i++) {
      const rowData = this.props.invoiceData[i] || {
        description: "",
        amount: "",
      };

      rows.push(
        <tr key={i}>
          <td>{rowData.description}</td>
          <td>{rowData.amount}</td>
        </tr>
      );
    }
    return rows;
  };
  render() {
    return (
      <div className="container">
        <div className="header">
          <h2 style={{ textAlign: "center" }}>Shree Physiotherapy Clinic</h2>
          {/* <h2 style={{ textAlign: "center" }}>Clinic</h2> */}
          <p className="date" style={{ textAlign: "right" }}>
            Date: {moment(this.props.invoiceData[0].date).format("DD-MMM-YYYY")}
            {/* Date: 22-Feb-2024 */}
          </p>
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
            {this.renderInvoiceRows()}
            <tr></tr>
            <div className="divider"></div>

            <tr>
              <td>Total Amount</td>
              <td>{this.state.totalSum}</td>
            </tr>
          </tbody>
        </table>
        <div className="divider"></div>

        <div className="thank-you">
          <p>Thank you. Get well soon!</p>
        </div>
      </div>
    );
  }
}

export default Invoice;
