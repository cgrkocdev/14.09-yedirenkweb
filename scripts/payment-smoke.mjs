import {
  albarakaCallbackApi,
  albarakaHash,
  albarakaInitializeApi,
} from "./server.js";

const values = new Map();
const store = {
  async put(key, value) { values.set(key, value); },
  async get(key, type) {
    const value = values.get(key);
    return type === "json" && typeof value === "string" ? JSON.parse(value) : value;
  },
  async delete(key) { values.delete(key); },
};
const env = {
  ALBARAKA_MERCHANT_NO: "6700950031",
  ALBARAKA_TERMINAL_NO: "67540050",
  ALBARAKA_EPOS_NO: "1010028724242434",
  ALBARAKA_ENC_KEY: "10,10,10,10,10,10,10,10",
  ALBARAKA_RETURN_URL: "https://example.org/api/payment/albaraka/callback",
  YEDIRENK_DONATIONS: store,
};
const assert = (condition, name) => {
  if (!condition) throw new Error(`${name}: FAIL`);
  console.log(`${name}: PASS`);
};

assert(
  (await albarakaHash("6700950031675400505400619360964581056200117510,10,10,10,10,10,10,10")) ===
    "xuhPbpcPJ6kVs7JeIXS8f06Cv0mb9cNPMfjp1HiB7Ew=",
  "initial-mac-vector",
);
assert(
  (await albarakaHash("02jKOBaLBL3hQ+CREBPu1HBQQAAAA=1Authenticated0161010028947569644,0161010028947569644101002894756964410,10,10,10,10,10,10,10")) ===
    "r21kMm4nMqvJakjq47Jl+3fk2xrFPrDoTJFQGxkgkfk=",
  "callback-mac-vector",
);
assert(
  (await albarakaHash("6700950031675400501010028947569644jKOBaLBL3hQ+CREBPu1HBQQAAAA=02110,10,10,10,10,10,10,10")) ===
    "kAKxvbwXvmrM6lapGx1UcRTs454tsSuPrBXV7oA7L7w=",
  "sale-mac-vector",
);

const initResponse = await albarakaInitializeApi(
  new Request("https://example.org/api/payment/albaraka/initialize", {
    method: "POST",
    headers: { Origin: "https://example.org", "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: 1.75, consent: true, firstName: "Test", lastName: "Donor",
      phone: "05330000000", email: "test@example.org", description: "Test bağışı",
      campaign: "Test", items: [{ title: "Test", quantity: 1, unitPrice: 1.75 }],
      card: { holderName: "TEST DONOR", number: "5400619360964581", cvv: "056", expiry: "2001" },
    }),
  }),
  env,
);
const initialized = await initResponse.json();
assert(initResponse.status === 200, "initialize-status");
assert(initialized.fields.Mac === "xuhPbpcPJ6kVs7JeIXS8f06Cv0mb9cNPMfjp1HiB7Ew=", "initialize-mac");
assert(["PosnetID","MerchantNo","TerminalNo","OrderId","TransactionType","CardNo","ExpiredDate","Cvv","CardHolderName","Amount","InstallmentCount","MerchantReturnURL","Language","CurrencyCode","Mac","MacParams","UseJokerVadaa","KOICode","OpenNewWindow","UseOOS","TxnState","VftCode","gsmNo","packetCode"].every((name) => Object.hasOwn(initialized.fields, name)), "initialize-required-fields");
const pendingRaw = values.get(`payment-pending:${initialized.orderId}`);
assert(pendingRaw && !pendingRaw.includes("540061") && !pendingRaw.includes("056"), "card-data-not-stored");

const callbackOrder = "ALB_TST_19091423_029";
await store.put(`payment-pending:${callbackOrder}`, JSON.stringify({ orderId: callbackOrder, amount: 175, currencyCode: "TL", installmentCount: 0, createdAt: Date.now(), status: "3d_pending" }));
const callback = new URLSearchParams({ OrderId: callbackOrder, ECI: "02", CAVV: "jKOBaLBL3hQ+CREBPu1HBQQAAAA=", MdStatus: "1", MdErrorMessage: "Authenticated", MD: "0161010028947569644,0161010028947569644", SecureTransactionId: "1010028947569644", Mac: "r21kMm4nMqvJakjq47Jl+3fk2xrFPrDoTJFQGxkgkfk=" });
const originalFetch = globalThis.fetch;
let saleRequest;
let saleCalls = 0;
globalThis.fetch = async (_url, options) => {
  saleCalls += 1;
  saleRequest = JSON.parse(options.body);
  return new Response(JSON.stringify({ ServiceResponseData: { ResponseCode: "00", ResponseDescription: "Onaylandı" }, AuthCode: "395351", ReferenceCode: "021439535190000191" }), { status: 200, headers: { "Content-Type": "application/json" } });
};
const callbackResponse = await albarakaCallbackApi(new Request("https://example.org/api/payment/albaraka/callback", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: callback }), env);
globalThis.fetch = originalFetch;
assert(callbackResponse.status === 200, "full-3d-callback");
assert(saleRequest?.MAC === "kAKxvbwXvmrM6lapGx1UcRTs454tsSuPrBXV7oA7L7w=", "sale-request-mac");
assert(["ApiType","ApiVersion","MerchantNo","TerminalNo","PaymentInstrumentType","CipheredData","DealerData","PaymentFacilitatorData","AdditionalInfoData","CardInformationData","IsEncrypted","IsTDSecureMerchant","IsMailOrder","IsRecurring","ThreeDSecureData","MAC","MACParams","Amount","CurrencyCode","PointAmount","OrderId","InstallmentCount","InstallmentType","KOICode","MerchantMessageData"].every((name) => Object.hasOwn(saleRequest, name)), "sale-model-fields");
assert([...values.keys()].some((key) => key.startsWith("donation:") && key.endsWith(callbackOrder)), "paid-donation-stored");

const duplicateResponse = await albarakaCallbackApi(new Request("https://example.org/api/payment/albaraka/callback", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: callback }), env);
assert(duplicateResponse.status === 400 && saleCalls === 1, "duplicate-callback-blocked");

const mismatchOrder = "ALB_TST_19091423_030";
await store.put(`payment-pending:${mismatchOrder}`, JSON.stringify({ orderId: mismatchOrder, amount: 175, currencyCode: "TL", installmentCount: 0, createdAt: Date.now(), status: "3d_pending" }));
const mismatch = new URLSearchParams(callback);
mismatch.set("OrderId", mismatchOrder);
mismatch.set("Amount", "999");
const mismatchResponse = await albarakaCallbackApi(new Request("https://example.org/api/payment/albaraka/callback", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: mismatch }), env);
assert(mismatchResponse.status === 400 && saleCalls === 1, "callback-order-data-mismatch-blocked");

const tampered = new URLSearchParams(callback);
tampered.set("OrderId", "ALB_TST_19091423_031");
tampered.set("Mac", "invalid");
const tamperedResponse = await albarakaCallbackApi(new Request("https://example.org/api/payment/albaraka/callback", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: tampered }), env);
assert(tamperedResponse.status === 400 && saleCalls === 1, "tampered-callback-blocked");
