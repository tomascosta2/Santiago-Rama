import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import { coachFullName } from "./utils/constantes";

export const metadata: Metadata = {
  title: `${coachFullName} Fit - Baja entre 5 y 15 kilogramos de grasa con mi metodo para adultos ocupados`,
  description: `${coachFullName} Fit - Baja entre 5 y 15 kilogramos de grasa con mi metodo para adultos ocupados`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* Meta Pixel Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1391736115664543');
              fbq('track', 'PageView');
            `,
          }}
        />
        {/* Meta Pixel NoScript */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1391736115664543&ev=PageView&noscript=1"
          />
        </noscript>

        <Script id="hotjar" strategy="afterInteractive">
          {`
          (function(h,o,t,j,a,r){
            h.hj = h.hj || function () { (h.hj.q = h.hj.q || []).push(arguments) };
            h._hjSettings={hjid:6503658,hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `}
        </Script>

        {/* X conversion tracking base code */}
        <Script id="x-conversion-tracking" strategy="afterInteractive">
          {`
            !function(e,t,n,s,u,a){
              e.twq||(s=e.twq=function(){
                s.exe ? s.exe.apply(s,arguments) : s.queue.push(arguments);
              },
              s.version='1.1',
              s.queue=[],
              u=t.createElement(n),
              u.async=!0,
              u.src='https://static.ads-twitter.com/uwt.js',
              a=t.getElementsByTagName(n)[0],
              a.parentNode.insertBefore(u,a))
            }(window,document,'script');

            twq('config','pffjj');
          `}
        </Script>
        {/* End X conversion tracking base code */}

        <link rel="preconnect" href="https://assets.calendly.com" crossOrigin="" />
        <link rel="preconnect" href="https://calendly.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://assets.calendly.com" />
        <link rel="dns-prefetch" href="https://calendly.com" />

      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
