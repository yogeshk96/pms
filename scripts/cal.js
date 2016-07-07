$(document).ready(function(){
	
	$(document).on('focus', '#tdate', function(){
		$( "#tdate" ).datepicker({dateFormat: 'dd-mm-yy'});
	});

	$(document).on('focus', '#fdate', function(){
		$( "#fdate" ).datepicker({dateFormat: 'dd-mm-yy'});
	});

	$(document).on('keyup', '.lapexp_inp_exp', function(){
		this.value = this.value.replace(/[^0-9]/g, '');
	});
				
				
});