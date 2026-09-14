import { describe, expect, it } from "vitest";

import { PaymentModule } from "../src/index";

const modulesManagerWith = (invoicePaymentMode) => ({
  getConf: (module, key, defaultValue) =>
    module === "fe-policy" && key === "enableInvoicePaymentMode"
      ? invoicePaymentMode
      : defaultValue,
});

describe("PaymentModule configuration", () => {
  it("hides the payments entry of the insuree menu when the invoice payment mode is enabled", () => {
    const config = PaymentModule({});

    expect(config["insuree.MainMenu"](modulesManagerWith(true))).toEqual([
      { route: "payment/payments", hide: true },
    ]);
  });

  it("keeps the payments entry of the insuree menu when the invoice payment mode is disabled", () => {
    const config = PaymentModule({});

    expect(config["insuree.MainMenu"](modulesManagerWith(false))).toEqual([
      { route: "payment/payments", hide: false },
    ]);
  });

  it("defaults the invoice payment mode to disabled when the config is not set", () => {
    const config = PaymentModule({});

    expect(
      config["insuree.MainMenu"]({
        getConf: (module, key, defaultValue) => defaultValue,
      })
    ).toEqual([{ route: "payment/payments", hide: false }]);
  });

  it("keeps the invoice main menu untouched", () => {
    const config = PaymentModule({});

    expect(config["invoice.MainMenu"]).toEqual([
      { route: "payment/paymentsInvoice" },
    ]);
  });
});
