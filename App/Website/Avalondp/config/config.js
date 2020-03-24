var appConfig = {
    root: window.location.pathname.split("/")[1],
    greentivity_root:"js",
    title:"Avalondp",
    app_version: 1,
    greentivity_image_location: "http://localhost:8080/images/upload/greentivity/",
    image_upload_url: "http://localhost:8080/FileUploaderRESTService/rest/image/upload",
    image_file_path: "C:\\ShopOn\\tomcat7\\webapps\\images\\upload\\greentivity\\",
    resume_file_path: "C:\\ShopOn\\tomcat7\\webapps\\images\\files\\greentivity\\",
    location:" http://localhost:60952/",
    printer_url: "http://localhost:8080/woto-utility-rest/rest/communication/print",
};

var androidApp = false;
var androidDev = false;

var footerTemplate = [];
footerTemplate.push('<div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 footer-panel"><h5>Customer Service</h5><h6><a href="../pages/orders.html">Order History</a></h6><h6><a href="#">Return Policy</a></h6></div>');
footerTemplate.push('<div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 footer-panel"><h5>My Account</h5><h6><a href="../pages/account.html">Manage Your Account</a></h6><h6><a href="../pages/customer-reward.html">Rewards</a></h6><h6><a href="../pages/address-book.html">Address Book</a></h6></div>');
footerTemplate.push('<div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 footer-panel"><h5>Company Information</h5><h6><a href="../pages/aboutus.html">About Avalon</a></h6><h6><a href="../pages/hours-and-location.html">Hours and Location</a></h6></div>');
footerTemplate.push('<div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 footer-panel"><h5>Contact Us</h5><h6><i class="fa fa-phone"></i>&nbsp;&nbsp;+91&nbsp;-&nbsp;91760 &nbsp; 77111</h6><h6><i class="fa fa-map-marker"></i>&nbsp;&nbsp;No 2, First Floor, VMP Complex, 200 Feet Radial Road, Narayanapuram, Pallikaranai, Chennai, Tamil Nadu - 600100</h6></div>');
footerTemplate.push('<span class="col-xs-12">&nbsp;</span>');
footerTemplate.push('<span class="col-xs-12 label-para-style-4" style="color:white !important;">Copyright 2020 Avalon, All Rights Reserved</span>');
footerTemplate.push('<span class="col-xs-6 footer-icon-panel" style="height:5px;">');
//footerTemplate.push('<a href="#" target="_blank"><i class=" fa fa-facebook footer-icon-style-1"></i></a>');
//footerTemplate.push('<a href="#" target="_blank"><i class=" fa fa-linkedin footer-icon-style-1"></i></a>');
//footerTemplate.push('<a href="#" target="_blank"><i class="fa fa-youtube-play footer-icon-style-2"></i></a>');
//footerTemplate.push('<a href="#" target="_blank"><i class="fa fa-twitter footer-icon-style-1"></i></a>');
//footerTemplate.push('<a href="#" target="_blank"><i class="fa fa-skype footer-icon-style-1"></i></a>');
footerTemplate.push('<span class="footer-empty-panel">&nbsp;</span>');
footerTemplate.push('</span>');
footerTemplate.push('');