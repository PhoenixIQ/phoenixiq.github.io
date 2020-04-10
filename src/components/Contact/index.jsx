import React from "react";

function Contact() {
  return (
    <div>
      <div className="margin-bottom--md">
        {/* <img className="navbar__logo" src="/img/footer.png" alt="logo" width="260"/> */}
        <h4 className="footer__title">联系我们</h4>
      </div>
      <ul class="footer__items">
        <li class="footer__item">
          <a class="footer__link-item" href="https://github.com/PhoenixIQ">
            GitHub： https://github.com/PhoenixIQ
          </a>
        </li>
        <li class="footer__item">
          <a class="footer__link-item" href="mailto:phoenix@iquantex.com">
            Email： phoenix@iquantex.com
          </a>
        </li>
        <li class="footer__item" style={{ paddingTop: "12px" }}>
          <a class="footer__link-item">
            <img
              src="/img/QRCode.png"
              alt="钉钉群二维码"
              width="180"
              height="180"
            />
          </a>
        </li>
      </ul>
    </div>
  );
}

export default Contact;
