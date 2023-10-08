var locale = "en-US";

const ctx2 = document.getElementById('emi_chart');
const chart_emi = new Chart(ctx2, {
    type: 'doughnut',
    data: {
        labels: [
            'Principal',
            'Interest'
        ],
        datasets: [{
            label: 'EMI Chart',
            display: true,
            data: [300, 100],
            backgroundColor: [
                'rgb(73, 54, 114)',
                '#8b2341'
            ],
            hoverOffset: 4
        }]
    },
    options: {
        tooltips: {
            mode: "dataset"
        }
        // data: {
        //     active: false,
        //     display: false
        // }
    }
});


const ctx = document.getElementById('sip_chart');
const chart_sip = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: [
            'Principal',
            'Returns'
        ],
        datasets: [{
            label: 'SIP Chart',
            display: false,
            data: [300, 100],
            backgroundColor: [
                'rgb(73, 54, 114)',
                // '#a3a72f',
                '#0e4616'
            ],
            hoverOffset: 4
        }]
    },
    options: {
        data: {
            active: false,
            display: false
        }
    }
});
chart_sip.data.datasets[0].data = [200,200];
chart_sip.update();

$(document).on('input', '#slider_loan_amt', function() {
    $('#value_loan_amt').html( (parseInt($(this).val()).toLocaleString(locale)) );
    emi_calculator();
    sip_lumpsum_calculator();
});

$(document).on('mouseup keyup touchend', '#slider_loan_amt', function() {
    max = parseInt($(this).attr("max"));
    min = parseInt($(this).attr("min"));
    step = $(this).attr("step");
    if ($(this).val() == max){
        if (max<500000){
            $(this).attr("max", max+100000);
        }
        else if (max==500000){
            console.log(max);
            $(this).attr("max", 5000000);
            $(this).attr("min", 500000);
            step = 25000;
            $(this).attr("step", step);
        }
        else{
            console.log(max);
            $(this).attr("max", max*2);
            $(this).attr("min", $(this).attr("max")/2);
            $(this).attr("step", step*2);
        }

    }
    else if ($(this).val() == min){
        if(min>500000){
            $(this).attr("min", parseInt(min/2));
            $(this).attr("max", $(this).attr("min")*2);
            step = parseInt(step/2);
            $(this).attr("step", step);
        }
        else if (min>100000){
            $(this).attr("min", min-100000);
            $(this).attr("max", $(this).attr("min")*2);
            step = 5000;
            $(this).attr("step", step);
        }
// 2.5,2,2
    }
});


$(document).on('input', '#value_loan_amt', function() {
    loan_amt = parseInt($(this).text().replace(/,/g, ''));
    $('#slider_loan_amt').val(loan_amt);
    emi_calculator();
    sip_lumpsum_calculator();
});
$(document).on('focusout', '#value_loan_amt', function() {
    loan_amt = parseInt($(this).text().replace(/,/g, ''));
    $('#value_loan_amt').html(loan_amt.toLocaleString(locale));
});

$(document).on('input', '#slider_tenure', function() {
    $('#value_tenure').html( $(this).val() );
    $('#value_sip_tenure').html( $(this).val() );
    $('#slider_sip_tenure').val($(this).val());
    emi_calculator();
    sip_lumpsum_calculator();
});
$(document).on('input', '#value_tenure', function() {
    n = $('#value_tenure').text().trim();
    console.log(n);
    $('#slider_tenure').val(n);
    $('#value_sip_tenure').html( $(this).val() );
    $('#slider_sip_tenure').val(n);
    emi_calculator();
    sip_lumpsum_calculator();
});


$(document).on('input', '#slider_sip_tenure', function() {
    $('#value_sip_tenure').html( $(this).val() );
    // emi_calculator();
    sip_lumpsum_calculator();
});
$(document).on('input', '#value_sip_tenure', function() {
    n = $('#value_sip_tenure').text().trim();
    console.log(n);
    $('#slider_sip_tenure').val(n);
    // emi_calculator();
    sip_lumpsum_calculator();
});

$(document).on('input', '#slider_emi_rate', function() {
    $('#value_emi_rate').html( $(this).val());
    emi_calculator();
    sip_lumpsum_calculator();
});
$(document).on('input', '#value_emi_rate', function() {
    r = $(this).text().trim();
    $('#slider_emi_rate').val(r);
    emi_calculator();
    sip_lumpsum_calculator();
});


function emi_calculator(){
    p = $('#value_loan_amt').text().trim();
    p = parseInt(p.replace(/,/g, ''));
    r = $('#value_emi_rate').text().trim() / (12*100);
    n = $('#value_tenure').text().trim() * 12;
    emi = ((p * r * (1 + r) ** n) / ( ((1 + r) ** n) - 1));
    $('#value_emi_amt').html(parseInt(Math.round(emi * 100) / 100).toLocaleString(locale));
    interest = emi*n-p;
    $('#value_interest_amt').html(parseInt(Math.round(interest * 100) / 100).toLocaleString(locale));
    chart_emi.data.datasets[0].data = [p, interest];
    chart_emi.update();
    $('#section_emi_var').removeClass("lg:blur-sm");
    getAmortisationValues();
}

function sip_return_calculator(){
    sip = $('#value_sip_amt').text().trim();
    sip = parseInt(sip.replace(/,/g, ''));
    r = $('#value_sip_rate').text().trim() / (12*100);
    n = $('#value_sip_tenure').text().trim() * 12;
    emi = $('#value_emi_amt').text().trim();
    emi = parseInt(emi.replace(/,/g, ''));
    value_return = sip * (((1 + r) ** n)-1) * (1+r)/r;
    $('#value_sip_return_amt').html(parseInt(Math.round(value_return * 100) / 100).toLocaleString(locale));
    $('#value_outflow_amt').html(parseInt(Math.round((sip + emi) * 100) / 100).toLocaleString(locale));
    p = sip * n ;
    value_sip_return = value_return-p;
    p = parseInt(Math.round(p * 100) / 100);
    value_sip_return = parseInt(Math.round(value_sip_return * 100) / 100);
    $('#value_sip_return').html(parseInt(value_sip_return).toLocaleString(locale));
    chart_sip.data.datasets[0].data = [p, value_sip_return];
    chart_sip.update();
}

function sip_calculator(){
    value_interest_amt = $('#value_interest_amt').text().trim()
    value_sip_return =  parseInt(value_interest_amt.replace(/,/g, ''));
    // $('#value_sip_return_amt').html(parseInt(value_return).toLocaleString(locale));
    r = $('#value_sip_rate').text().trim() / (12*100);
    n = $('#value_sip_tenure').text().trim() * 12;
    emi = $('#value_emi_amt').text().trim();
    emi = parseInt(emi.replace(/,/g, ''));
    sip_coefficient = (((1 + r) ** n)-1) * (1+r)/r

    // p = (value_return / sip_coefficient) * n ;
    // value_sip_return = value_return * [1 - (1 / sip_coefficient) * n] ;
    value_return = value_sip_return / (1 - (1 / sip_coefficient) * n)
    $('#value_sip_return_amt').html(parseInt(value_return).toLocaleString(locale));


    sip_amt = value_return / sip_coefficient ;


    $('#value_sip_amt').html(parseInt(Math.round(sip_amt * 10) / 10).toLocaleString(locale));
    $('#value_outflow_amt').html(parseInt(Math.round((sip_amt + emi) * 10) / 10).toLocaleString(locale));
    // value_sip_return = value_return-p;
    p = sip_amt * n ;
    p = parseInt(Math.round(p * 10) / 10);
    value_sip_return = parseInt(Math.round(value_sip_return * 10) / 10);
    $('#value_sip_return').html(parseInt(value_sip_return).toLocaleString(locale));
    chart_sip.data.datasets[0].data = [p, value_sip_return];
    chart_sip.update();
}

function lumpsum_return_calculator(){
    p = $('#value_sip_amt').text().trim();
    p = parseInt(p.replace(/,/g, ''));
    r = $('#value_sip_rate').text().trim() / 100;
    n = $('#value_sip_tenure').text().trim();
    value_sip_return_amt = p * ((1 + r)**n);
    $('#value_sip_return_amt').html(parseInt(Math.round(value_sip_return_amt * 10) / 10).toLocaleString(locale));

    // update chart
    value_sip_return = value_sip_return_amt - p;
    p = parseInt(Math.round(p * 10) / 10);
    $('#value_sip_return').html(parseInt(value_sip_return).toLocaleString(locale));
    value_sip_return = parseInt(Math.round(value_sip_return * 10) / 10);
    chart_sip.data.datasets[0].data = [p, value_sip_return];
    chart_sip.update();
}

function lumpsum_calculator(){
    value_interest_amt = $('#value_interest_amt').text().trim()
    value_sip_return =  parseInt(value_interest_amt.replace(/,/g, ''));
    $('#value_sip_return').html(parseInt(value_sip_return).toLocaleString(locale));

    r = $('#value_sip_rate').text().trim() / 100;
    n = $('#value_sip_tenure').text().trim();
    lumpsum_coefficient = (1 + r)**n

    // value_sip_return + lumpsum_amt = value_return;

    lumpsum_amt = (value_sip_return / lumpsum_coefficient ) / (1 - 1 / lumpsum_coefficient) ;

    $('#value_sip_amt').html(parseInt(Math.round(lumpsum_amt * 10) / 10).toLocaleString(locale));
    // update chart
    p = lumpsum_amt ;
    value_sip_return_amt = value_sip_return + p;
    // $('#value_sip_return_amt').html(value_sip_return_amt);
    $('#value_sip_return_amt').html(parseInt(Math.round(value_sip_return_amt * 10) / 10).toLocaleString(locale));
    // $('#value_sip_return').html(parseInt(value_sip_return).toLocaleString(locale));

    
    chart_sip.data.datasets[0].data = [p, value_sip_return];
    chart_sip.update();
}

function set_margin_sip_chart(className){
    if ($( "#div_sip_chart" ).hasClass("mt-10")) {
        $( "#div_sip_chart" ).removeClass('mt-10');
    }
    if ($( "#div_sip_chart" ).hasClass("mt-14")) {
        $( "#div_sip_chart" ).removeClass('mt-14');
    }

    $( "#div_sip_chart" ).addClass(className); 
}


/**
 * A function that calculates the SIP or Lumpsum amount based on the checkbox input.
 *
 * @return {undefined} Does not return a value.
 */
function sip_lumpsum_calculator(){
    if ( $('#checkbox_lumpsum').is(":checked") == false ) {
        $('#text_sip_amt').html("Lumpsum");
        lumpsum_calculator();
        $('#div_outflow').css('visibility','hidden');
    } else {
        $('#text_sip_amt').html("Sip Amount");
        sip_calculator();
        $('#div_outflow').css('visibility','visible');
    }
}


function sip_lumpsum_return_calculator(){
    if ( $('#checkbox_lumpsum').is(":checked") == true ) {
        $('#text_sip_amt').html("Lumpsum");
        lumpsum_return_calculator();
    } else {
        $('#text_sip_amt').html("Sip Amount");
        sip_return_calculator();
    }
}

$(document).on('input', '#slider_sip_rate', function() {
    $('#value_sip_rate').html( $(this).val());
    sip_lumpsum_calculator();
    $('#panel_sip').removeClass("lg:blur-sm");
});
$(document).on('input', '#value_sip_rate', function() {
    $('#slider_sip_rate').val( $(this).text());
    sip_lumpsum_calculator();
});

$(document).on('input', '#value_sip_amt', function() {
    sip_lumpsum_return_calculator();
});
$(document).on('focusout', '#value_sip_amt', function() {
    sip_amt = parseInt($(this).text().replace(/,/g, ''));
    $('#value_sip_amt').html(sip_amt.toLocaleString(locale));
});

$(document).on('change', '#checkbox_lumpsum', function() {
    sip_lumpsum_calculator();
});



// ###########     Update Number System    #############

$(document).on('change', '#checkbox_number_system', function() {
    toggle_number_system();
});

function toggle_number_system(){
    if (locale == "en-US"){
        locale = "en-IN";
    }
    else{
        locale = "en-US";
    }
    update_locale();
}

function update_locale(){
    sip_lumpsum_calculator();
    emi_calculator();
    loan_amt = parseInt($('#value_loan_amt').text().replace(/,/g, ''));
    $('#value_loan_amt').html(loan_amt.toLocaleString(locale));
}



// ###########     Update Blur    #############

$(document).on('mouseover', '.hover-unblur', function(){
    $(this).removeClass("lg:blur-sm");
});


function setCursor(elem, pos) {
    // var tag = document.getElementById("value_loan_amt");
    var tag = elem;
    // Creates range object
    var setpos = document.createRange();
        
    // Creates object for selection
    var set = window.getSelection();
        
    // Set start position of range
    setpos.setStart(tag.childNodes[0], pos);
        
    // Collapse range within its boundary points
    // Returns boolean
    setpos.collapse(true);
        
    // Remove all ranges set
    set.removeAllRanges();
        
    // Add range with respect to range object.
    set.addRange(setpos);
        
    // Set cursor on focus
    tag.focus();
}


$(".editable").on('mouseover',function(e){
    setCursor(this, 0);
    });


$(".editable").on('keyup',function(e){
    sel = window.getSelection();
    if($(sel.anchorNode).is($(this))){
        pos = '0'
    }else{
        pos = sel.anchorOffset;
    }
    // console.log(pos);
    loan_amt = parseInt($(this).text().replace(/,/g, ''));
    $(this).html(loan_amt.toLocaleString(locale));
    setCursor(this, pos);
    });

    

//  function getCountry(){
//     $.get("https://ipinfo.io", function(response) {
//         country = response.country;
//         console.log(country);
//     }, "jsonp");
    
//  }

function getLang() {
    if (navigator.languages != undefined) 
        return navigator.languages[0]; 
    return navigator.language;
}


//  Loan amortisation table


function getAmortisationValues()
{
    //button click gets values from inputs
    // var balance = parseFloat(document.getElementById("principal").value);
    // var interestRate = 
    //     parseFloat(document.getElementById("interest").value/100.0);
    // var terms = parseInt(document.getElementById("terms").value);

    balance = $('#value_loan_amt').text().trim();
    balance = parseInt(balance.replace(/,/g, ''));
    interestRate = $('#value_emi_rate').text().trim() / 100;
    terms = $('#value_tenure').text().trim() * 12;
    
    //set the div string
    var div = document.getElementById("div_amortisation");
    
    //in case of a re-calc, clear out the div!
    div.innerHTML = "";
    
    //validate inputs - display error if invalid, otherwise, display table
    var balVal = validateInputs(balance);
    var intrVal = validateInputs(interestRate);

    if (balVal && intrVal)
    {
        //Returns div string if inputs are valid
        div.innerHTML += amort(balance, interestRate, terms);
    }
    else
    {
        //returns error if inputs are invalid
        div.innerHTML += "Please Check your inputs and retry - invalid values.";
    }
}

/**
 * Amort function:
 * Calculates the necessary elements of the loan using the supplied user input
 * and then displays each months updated amortization schedule on the page
*/
function amort(balance, interestRate, terms)
{
    //Calculate the per month interest rate
    var monthlyRate = interestRate/12;
    
    //Calculate the payment
    var payment = balance * (monthlyRate/(1-Math.pow(
        1+monthlyRate, -terms)));
        
    //begin building the return string for the display of the amort table
    var result = "<span class='font-bold'>Loan amount: </span>" + parseInt(balance).toLocaleString(locale) +  "<br />" + 
        "<span class='font-bold'>Interest rate:  </span>" + (interestRate*100).toFixed(2) +  "%<br />" +
        "<span class='font-bold'>Number of months: </span>" + terms + "<br />" +
        "<span class='font-bold'>Monthly payment: </span>" + parseInt(payment).toLocaleString(locale) + "<br />" +
        "<span class='font-bold'>Total paid: </span>" + parseInt(payment * terms).toLocaleString(locale) + "<br /><br />";
        
    //add header row for table to return string
    result += "<table class='xxs:text-md sm:text-lg mt-10 border-spacing-2 border-solid border-4 table-auto'>" +
        "<tr class='border-solid border-4'><th> Year </th><th>Balance</th>" + 
        "<th>Interest</th><th>Principal</th>";
    
    /**
     * Loop that calculates the monthly Loan amortization amounts then adds 
     * them to the return string 
     */
        var interest = 0;
        var monthlyPrincipal = 0;
        var annualPrincipal = 0;
        var annualInterest = 0;

    for (var count = 0; count <= terms; ++count)
    {
        if(count != terms){
            //calc the in-loop interest amount and display
            interest = balance * monthlyRate ;
            annualInterest += interest;

            monthlyPrincipal = payment - interest;
            annualPrincipal = annualPrincipal + monthlyPrincipal;

            //update the balance for each loop iteration
            balance = balance - monthlyPrincipal;	
        } else {
            //calc the in-loop interest amount and display
            interest = balance * monthlyRate ;
            annualInterest += interest;

            monthlyPrincipal = payment - interest;
            annualPrincipal = annualPrincipal + monthlyPrincipal;

            //update the balance for each loop iteration
            balance = balance - monthlyPrincipal;
        }

        if ((count % 12 == 0 && count !=0)) {

            //calc the in-loop monthly principal and display
            // annualPrincipal = payment - interest;

            //start a new table row on each loop iteration
            result += "<tr align=center class='ml-4 border-4'>";
            
            //display the month number in col 1 using the loop count variable
            result += "<td class='lg:px-12 sm:px-8 xs:px-3 xxs:pl-2 xxxs:pl-2 py-4'>" + (count / 12) + "</td>";
            
            //code for displaying in loop balance
            result += "<td class='lg:px-12 sm:px-8 xs:px-4 xxs:px-4 xxxs:px-3 py-4'> " + parseInt(balance).toLocaleString(locale) + "</td>";
            

            result += "<td class='lg:px-12 sm:px-8 xs:px-4 xxs:px-4 xxxs:px-3 py-4'> " + parseInt(annualInterest).toLocaleString(locale) + "</td>";
            

            result += "<td class='lg:px-12 sm:px-8 xs:px-4 xxs:px-4 xxxs:px-3 py-4'> " + parseInt(annualPrincipal).toLocaleString(locale) + "</td>";
            
            //end the table row on each iteration of the loop	
            result += "</tr>";


            //in-loop interest amount holder
            annualInterest = 0;
            
            //in-loop monthly principal amount holder
            annualPrincipal = 0;
        }


    }
    
    //Final piece added to return string before returning it - closes the table
    result += "</table>";
    
    //returns the concatenated string to the page
    return result;
}

function validateInputs(value)
{
    //some code here to validate inputs
    if ((value == null) || (value == ""))
    {
        return false;
    }
    else
    {
        return true;
    }
}

$( document ).ready(function() {
    locale = getLang();
    console.log(locale);
    // country = getCountry();
    emi_calculator();
    $('#section_emi_var').addClass("lg:blur-sm");
    sip_lumpsum_calculator();
});