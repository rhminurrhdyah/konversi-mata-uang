let api = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;
const fromDropDown = document.getElementById("from-currency-select");
const toDropDown = document.getElementById("to-currency-select");

//Create dropdown from the currencies array
currencies.forEach((currency) => {
  const option = document.createElement("option");
  option.value = currency;
  option.text = currency;
  fromDropDown.add(option);
});

//Repeat same thing for the other dropdown
currencies.forEach((currency) => {
  const option = document.createElement("option");
  option.value = currency;
  option.text = currency;
  toDropDown.add(option);
});

//Setting default values
fromDropDown.value = "USD";
toDropDown.value = "IDR";

let convertCurrency = () => {
  //Create References
  const amount = document.querySelector("#amount").value.trim();
  const fromCurrency = fromDropDown.value;
  const toCurrency = toDropDown.value;
  const alertContainer = document.querySelector("#alertContainer");
  const result = document.querySelector("#result");

  // Clear previous alert
  if (alertContainer) alertContainer.innerHTML = "";

  // Validate amount
  if (!amount || isNaN(amount)) {
    if (alertContainer) {
      alertContainer.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          Masukkan jumlah yang valid (hanya angka, tanpa simbol).
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      `;
    } else {
      alert("Masukkan jumlah yang valid (hanya angka, tanpa simbol).");
    }
    return;
  }

  fetch(api)
  .then((resp) => resp.json())
  .then((data) => {
    let fromExchangeRate = data.conversion_rates[fromCurrency];
    let toExchangeRate = data.conversion_rates[toCurrency];
    const convertedAmount = (amount / fromExchangeRate) * toExchangeRate;

    const formattedAmount = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: toCurrency,
      maximumFractionDigits: 2,
    }).format(convertedAmount);

    const formattedInputAmount = new Intl.NumberFormat("id-ID", {
      maximumFractionDigits: 2,
    }).format(amount);

    // ✅ Ini exchange rate langsung dari fromCurrency ke toCurrency
    const directExchangeRate = toExchangeRate / fromExchangeRate;
    const formattedDirectRate = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: toCurrency,
      maximumFractionDigits: 2,
    }).format(directExchangeRate);

    // Konversi waktu update dari UTC ke WIB
    const localTime = new Date(data.time_last_update_utc).toLocaleString("id-ID", {
      timeZone: "Asia/Jakarta",
      dateStyle: "full",
      timeStyle: "short"
    });

    result.innerHTML = `${formattedInputAmount} ${fromCurrency} = ${formattedAmount}`;

    const apiResponseContainer = document.getElementById("api-response");
    apiResponseContainer.innerHTML = `
      <div class="alert alert-info mt-3" role="alert"> 
        1 ${fromCurrency} = ${formattedDirectRate} ${toCurrency} |
        Sumber kurs: <strong>${data.base_code}</strong> <br/>
        Waktu update kurs: ${localTime} (WIB)
      </div>
    `;
  });

};


document
  .querySelector("#convert-button")
  .addEventListener("click", convertCurrency);
window.addEventListener("load", convertCurrency);

document.addEventListener("DOMContentLoaded", function () {
    const fromSelect = document.getElementById("from-currency-select");
    const toSelect = document.getElementById("to-currency-select");
    const swapButton = document.querySelector(".bi-arrow-left-right");

    swapButton.style.cursor = "pointer"; // Ubah cursor menjadi pointer saat hover

    swapButton.addEventListener("click", function () {
      // Simpan sementara nilai dari select pertama
      const tempValue = fromSelect.value;

      // Tukar nilai dari kedua select
      fromSelect.value = toSelect.value;
      toSelect.value = tempValue;
    });
  });

  