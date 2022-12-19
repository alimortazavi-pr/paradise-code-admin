import Document, { Html, Head, Main, NextScript } from "next/document";
import { CssBaseline } from "@nextui-org/react";
import React from "react";

class MyDocument extends Document {
  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx);
    return {
      ...initialProps,
      styles: React.Children.toArray([initialProps.styles]),
    };
  }

  render() {
    return (
      <Html data-theme="light" dir="rtl">
        <Head>{CssBaseline.flush()}</Head>
        <link rel="manifest" href="/manifest.json" />
        {/* <link
          rel="apple-touch-icon"
          href="assets/icons/apple-touch-icon.png"
        ></link> */}
        <meta name="theme-color" content="#f3f4f6" />
        <body className="bg-gray-100">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
