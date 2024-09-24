import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { login } from "../../shopify.server";
import styles from "./styles.css";

import { logo } from "../assets";

export const loader = async ({ request }) => {
  const url = new URL(request.url);

  if (url.searchParams.get("shop")) {
    throw redirect(`/app?${url.searchParams.toString()}`);
  }

  return json({ showForm: Boolean(login) });
};

export default function App() {
  const { showForm } = useLoaderData();

  return (
    <>
<div className="header">
        <div className="app_header">
          <div className="applogo">
<img src={logo} alt="app_logo" style={{width:'130px'}}/>
          </div>
          <div className="app_title">
          <h2>All-In-One Store</h2>
          <p> All Your Store's Essentials in One Powerful App</p>
          </div>
        </div>
      </div>
      <div className="form_section">
      <span>Shop domain</span>
      {showForm && (
          <Form method="post" action="/auth/login">
             <input type="text" name="shop" />
              <small>e.g: my-shop-domain.myshopify.com</small>
           
            <button type="submit">Log in</button>
          </Form>
        )}
      </div>
    <div className="index">
      <div className="content">
  <ul>
          <li>
            <strong>Scroll Top-to-Bottom</strong> A simple yet powerful UI enhancement that allows users to quickly scroll back to the top of the page with a single click. This feature improves user navigation, especially on long product pages.
          </li>
          <li>
            <strong>Product Reviews</strong> An integrated product review system that displays customer feedback on product pages. Reviews include star ratings, text reviews, and customer photos.
          </li>
          <li>
            <strong> Sticky Cart on Product Page</strong> A sticky cart button that remains visible as users scroll through the product page, making it easy for them to add items to their cart without losing their place.
          </li>
        </ul>
        <strong>And many more features to enhance your store's performance and customer experience!</strong>
      </div>
    </div>
    </>
    // <div className={styles.index}>
    //   <div className={styles.content}>
    //     <h1 className={styles.heading}>A short heading about [your app]</h1>
    //     <p className={styles.text}>
    //       A tagline about [your app] that describes your value proposition.
    //     </p>
    //     {showForm && (
    //       <Form className={styles.form} method="post" action="/auth/login">
    //         <label className={styles.label}>
    //           <span>Shop domain</span>
    //           <input className={styles.input} type="text" name="shop" />
    //           <span>e.g: my-shop-domain.myshopify.com</span>
    //         </label>
    //         <button className={styles.button} type="submit">
    //           Log in
    //         </button>
    //       </Form>
    //     )}
    //     <ul className={styles.list}>
    //       <li>
    //         <strong>Product feature</strong>. Some detail about your feature and
    //         its benefit to your customer.
    //       </li>
    //       <li>
    //         <strong>Product feature</strong>. Some detail about your feature and
    //         its benefit to your customer.
    //       </li>
    //       <li>
    //         <strong>Product feature</strong>. Some detail about your feature and
    //         its benefit to your customer.
    //       </li>
    //     </ul>
    //   </div>
    // </div>
  );
}
