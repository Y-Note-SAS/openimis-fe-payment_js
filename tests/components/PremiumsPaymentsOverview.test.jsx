import React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { IntlProvider } from "react-intl";

import { PremiumsPaymentsOverview } from "../../src/components/PremiumsPaymentsOverview";

const buildProps = ({ invoicePaymentMode = false, overrides = {} } = {}) => ({
  modulesManager: {
    getConf: (module, key, defaultValue) =>
      module === "fe-policy" && key === "enableInvoicePaymentMode"
        ? invoicePaymentMode
        : defaultValue,
  },
  intl: { formatMessage: ({ id }) => id },
  history: { push: vi.fn() },
  family: { uuid: "family-1" },
  edited: null,
  premium: null,
  rights: [],
  readOnly: false,
  premiumsPayments: [],
  fetchingPremiumsPayments: false,
  errorPremiumsPayments: null,
  pageInfo: { totalCount: 0 },
  fetchPremiumsPayments: vi.fn(),
  deletePayment: vi.fn(),
  ...overrides,
});

const renderPanel = (props) =>
  render(
    <IntlProvider locale="en" messages={{}}>
      <PremiumsPaymentsOverview {...props} />
    </IntlProvider>
  );

describe("PremiumsPaymentsOverview", () => {
  it("renders nothing when the invoice payment mode is enabled", () => {
    const { container } = renderPanel(buildProps({ invoicePaymentMode: true }));

    expect(container).toBeEmptyDOMElement();
  });

  it("renders the payments panel when the invoice payment mode is disabled", () => {
    renderPanel(buildProps({ invoicePaymentMode: false }));

    expect(screen.getByText("PremiumsPayments")).toBeInTheDocument();
    expect(document.querySelector("table")).toBeInTheDocument();
  });

  it("renders nothing when the family has no uuid", () => {
    const { container } = renderPanel(
      buildProps({ overrides: { family: {} } })
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing for a polygamous family", () => {
    const { container } = renderPanel(
      buildProps({
        overrides: { family: { uuid: "family-1", familyType: { code: "P" } } },
      })
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("renders nothing for a polygamous edited family", () => {
    const { container } = renderPanel(
      buildProps({ overrides: { edited: { familyType: { code: "P" } } } })
    );

    expect(container).toBeEmptyDOMElement();
  });
});
