import Head from "next/head";

export default function NotFound() {
  return (
    <div>
      <Head>
        <title>خطا سرور | پارادایس کد</title>
      </Head>
      <div className="server-error grid w-full mt-20">
        <div id="error">
          <div id="box"></div>
          <h3>ERROR 500</h3>
          <p className="tracking-tight font-semibold">
            به نظر مشکلی از سمت <span>سرور</span> پیش آمده :(
          </p>
          <p className="tracking-tight font-semibold">
            پیشنهاد می‌کنم بعدا دوباره امتحان کنید
          </p>
        </div>
      </div>
    </div>
  );
}
