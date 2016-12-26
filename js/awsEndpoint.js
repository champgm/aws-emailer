function main() {
    var $skillset = $('.skillset');
    //   alert($skillset);
    $('.skillset').hide();
    $('.skillset').fadeIn(1000);

    $('.projects').hide();

    $('.projects-button').on('click',
        function () {
            $('.projects').toggle();
            $('.projects-button').toggleClass('.active');
        });
}


$(document).ready(main);