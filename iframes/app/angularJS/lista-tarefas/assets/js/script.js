$(document).ready(function () {
    $('.sidenav').sidenav();
    $('.back-history').click(function(e) { 
       e.preventDefault();
       window.history.back();
    });
    $('#mobile-demo a').click(function() { 
        $('.sidenav-overlay').click();
    });
    
});