import React from "react";
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div>
      <h2>Page Not Found</h2>
      <p>
        <Link to="/">Back to Home</Link>
      </p>
    </div>
  );
}

function MetaMaskIssue() {
  return (
    <div>
      <h2>Resolve Meta Mask Connection</h2>
      <p>
        <Link to="/">Back to Home</Link>
      </p>
    </div>
  );
}
export { NotFoundPage, MetaMaskIssue }
