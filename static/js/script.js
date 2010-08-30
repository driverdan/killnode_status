$(function() {
  if ($("#map").length) {
    PK.init();
  }
});

/* Application Showcase */
$(document).ready(function(){  	
		$('#slider').innerfade({
				animationtype: 'fade', 
				speed: '3000',
				timeout: 7000,
				type: 'sequence',
				containerheight: 'auto'
		});	
});

	
// /* Lightbox - Might re-enable for form modals? */
// $(document).ready(function(){
//     $('.boxgrid a').lightBox();
// 	});