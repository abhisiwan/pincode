function limitLength(input) {
  input.value = input.value.slice(0, 6).replace(/\D/g, "");

  document.getElementById("check-btn").disabled = input.value.length !== 6;
}

function demo() {
  var pincode = document.querySelector("#pincode").value.trim();
  var para = document.getElementById("para");
  var loading = document.getElementById("loading");

  loading.style.display = "block";
  para.innerHTML = "";
  para.className = "";

  if (!/^\d{6}$/.test(pincode)) {
    loading.style.display = "none";
    para.innerHTML = `
                <div class="error">
                    <i class="fas fa-exclamation-circle"></i> Please enter a valid 6-digit pincode.
                </div>
            `;
    para.className = "error";
    return;
  }

  $.ajax({
    type: "GET",
    url: "https://api.postalpincode.in/pincode/" + pincode,
    success: function (response) {
      loading.style.display = "none";

      if (response[0].Status === "Success") {
        var postOffices = response[0].PostOffice;
        var result =
          '<div class="success"><h3><i class="fas fa-check-circle"></i> Pincode Details</h3>';

        postOffices.forEach((po) => {
          result += `
                            <div class="post-office">
                                <h4><i class="fas fa-building"></i> ${po.Name}</h4>
                                <p><i class="fas fa-map"></i> ${po.District}, ${po.State}</p>
                                <p><i class="fas fa-globe"></i> ${po.Country}</p>
                                <p><i class="fas fa-mail-bulk"></i> Pincode: ${po.Pincode}</p>
                            </div>
                        `;
        });

        result += "</div>";
        para.innerHTML = result;
        para.className = "success";

        setTimeout(function () {
          $("#para").html("").removeClass();
        }, 50000);

        $("#pincode").val("");
        document.getElementById("check-btn").disabled = true;
      } else {
        para.innerHTML = `
                        <div class="error">
                            <i class="fas fa-times-circle"></i> Invalid Pincode or No Data Found.
                        </div>
                    `;
        para.className = "error";
      }
    },
    error: function () {
      loading.style.display = "none";
      para.innerHTML = `
                    <div class="error">
                        <i class="fas fa-exclamation-triangle"></i> Error fetching data. Please try again.
                    </div>
                `;
      para.className = "error";
    },
  });
}

document.getElementById("pincode").addEventListener("keypress", function (e) {
  if (e.key === "Enter" && this.value.length === 6) {
    demo();
  }
});
