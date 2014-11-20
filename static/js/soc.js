var funnelCache = {
    firstSignupModal: true,
    firstCalc: true,
    firstPriceModal: true,
    showLastCatch: false
};

$(document).ready(function () {


    if ($(".how-step").length > 0 && $(window).width() > 768) {
        $(".how-step").css("margin-top", (($(".how-step").parent().height() - $(".how-step").height()) / 2) - 5)
    }

    if ($(".index").length > 0) {
        var carouselcount;
        carouselcount = 0;
        $('.carousel').carousel({
            interval: 2000,
            pills: true
        }).on('slid', function (e) {
            carouselcount++;
            if (carouselcount >= 3) {
                $(this).carousel('pause');
            }
        })
    };
    $("#our-rates").on("click", function () {
        window.location = "/rates"
    });
    $("#learn-more").on("click", function () {
        window.location = "/how-it-works";
    });
    $("#signFromModal").on("click", function () {
        funnelCache.showLastCatch = false;
        $("#priceModal").modal("hide");
        $("#signModal").modal("toggle");
    });
    $(".signFromRates").on("click", function () {
        $("#signModal").modal("toggle");
    });
    $("#getEstimate").on("click", function () {
        funnelCache.firstCalc = false;
        var from = $("#inputFromPostalCode").val();
        var to = $("#inputToPostalCode").val();
        var weight = $("#inputWeight").val();
        if (!from || !to || !weight) {
            if (!from) {
                from = 90210;
            }
            if (!to) {
                to = 20500;
            }
            if (!weight) {
                weight = 1;
            }
        }
        $("#priceModal .priceRender").empty();
        getShippingEstimate(from, to, weight, "home");
        $("#getEstimate").button('loading');
    });
    $("#submitModalEstimate").on("click", function () {
        var from = $("#inputFromPostalCodeModal").val();
        var to = $("#inputToPostalCodeModal").val();
        var weight = $("#inputWeightModal").val();
        if (!from || !to || !weight) {
            if (!from) {
                from = 90210;
            }
            if (!to) {
                to = 20500;
            }
            if (!weight) {
                weight = 1;
            }
        }
        $("#priceModal .priceRender").empty();
        getShippingEstimate(from, to, weight, "funnel");
        $("#submitModalEstimate").button('loading');
    });



    $("#submitSign").on("click", function () {
        //var successMsg = "Your form has been submited, you will be contacted soon.";
        //var errorMsg = "Your form coun't be submited. Please contact us by phone.";
        $('#modalSignupForm').parsley('validate');
        var isItValid = $('#modalSignupForm').parsley('isValid');

        if (isItValid) {
            $("#modalSignupForm").submit();
            //var formSerialized = $("#modalSignupForm").serialize();
            //$("#modalSignupForm").submit();
            /*$.ajax({
			 url: "/?" + formSerialized,
			 type: 'POST',
			 data: '',
			 async: 'false',
			 dataType: 'json',
			 contentType: 'application/json',
			 success: function(j) {
			 showSuccessModal(successMsg);
			 },
			 error: function(){
			 showErrorModal(errorMsg);
			 }
			 })*/
        }
    });

    $("#errorModal").on("hidden", function () {
        $("#errorMessage").empty();
    });

    $("#successModal").on("hidden", function () {
        $("#errorMessage").empty();
    });

    $("#why").tooltip();


});

function parseShippingData(from, to, weight, data, caller) {




    $("#priceModal .message").empty();
    $("#priceModal .priceRender").empty();
    $("#priceMessage").html("<span>Your estimate from zip code <strong>" + from + "</strong> to zip code <strong>" + to + "</strong>, weight: <strong>" + weight + "lb </strong>.<span>")
    var newTable = '<table class="pricingTable autoGen" border="0" cellpadding="3"><col class="theDescription"/><col class="theirPrice"/><col class="ourRate"/><col class="youSave"/>';
    newTable = newTable + '<tbody><tr><th class="theDescriptionTh"></th>';
    newTable = newTable + '<th class="theirPriceTh">Their Rate</th>';
    newTable = newTable + '<th class="bigHeader"><div>Our Rate</div></th>';
    newTable = newTable + '<th class="youSaveTh">You Save</th>';
    newTable = newTable + '</tr>';
    $.each(data, function (i, shipInfo) {
        var provider = shipInfo.Provider;
        var service = shipInfo.ServiceType;
        var theirRate = shipInfo.Rate;
        var ourRate = shipInfo.OurPrice;
        var discount = shipInfo.Discount;

        if (i == data.length - 1) {
            newTable = newTable + "<tr class='last'>";
        } else {
            newTable = newTable + "<tr>";
        }

        if (provider == "FedEx") {
            newTable = newTable + "<td class='withLogo'><img src='/static/img/icons/fedex_logo_small.png'><strong>" + provider + "</strong> - " + service;
        } else if (provider == "UPS") {
            newTable = newTable + "<td class='withLogo'><img src='/static/img/icons/ups_logo_small.png' style='margin-right: 8px;'><strong>" + provider + "</strong> - " + service;
        } else {
            newTable = newTable + "<td class='withLogo'><strong>" + provider + "</strong> - " + service;
        }
        newTable = newTable + "</td><td class='theirPrice'> $" + theirRate + "</td><td class='ourRate'> $" + ourRate + "</td>";
        newTable = newTable + "<td class='youSave'> " + discount + "% </td></tr>";
    });
    newTable = newTable + "</table>";
    $("#priceModal .priceRender").append(newTable);
    $("#priceModal").modal("toggle");
    $("#getEstimate").button('reset');
};

function showSuccessModal(msg) {
    $("#successMessage").empty();
    $("#successMessage").append("<p>" + msg + "</p>");
    $("#successModal").modal("show");
}

function showErrorModal(msg) {
    $("#errorMessage").empty();
    $("#errorMessage").append("<p>" + msg + "</p>");
    $("#errorModal").modal("show");
}

function getShippingEstimate(from, to, weight, caller) {

    var url = "/rest/rates?senderZip=" + from + "&recipientZip=" + to + "&weight=" + weight + "";
    var theJson;
    $.ajax({
        url: url,
        type: 'GET',
        data: '',
        async: 'false',
        dataType: 'json',
        contentType: 'application/json',
        success: function (j) {
            theJson = j;
            parseShippingData(from, to, weight, j, caller);
        },
        statusCode: {
            500: function () {
                $("#errorMessage").empty();
                $("#errorMessage").append("<p>We are having difficulty confirming this rate at this time. Please rest assured that we can certainly offer great savings on this shipment. You may call us at 1-877-792-2780 to confirm our discounted rates.</p>");
                $("#errorModal").modal("show");
            }
        },
        error: function () {
            $("#getEstimate").button('reset');
            $("#submitModalEstimate").button('reset');
        }
    });
};


/* Event Listeners
---------------------------------------------------- */

$(window).resize(function () {
    if ($(".how-step").length > 0 && $(window).width() > 768) {
        $(".how-step").css("margin-top", (($(".how-step").parent().height() - $(".how-step").height()) / 2) - 5);
    } else if ($(".how-step").length > 0 && $(window).width() <= 768) {
        $(".how-step").css("margin-top", 0);
    }
});


$('#signModal').on('hidden.bs.modal', function () {
    if (funnelCache.firstSignupModal == true && funnelCache.firstPriceModal == true) {
        $("#estimateModal").modal('show');
    };
    funnelCache.firstSignupModal = false;

});

$('#estimateModal').on('shown.bs.modal', function () {
    funnelCache.firstCalc = false;
});


$("#priceModal").on("shown.bs.modal", function () {
    funnelCache.firstPriceModal = false;
    $("#inputFromPostalCodeModal").val("");
    $("#inputToPostalCodeModal").val("");
    $("#inputWeightModal").val("");
    $("#submitModalEstimate").button('reset');
    $("#estimateModal").modal('hide');
});