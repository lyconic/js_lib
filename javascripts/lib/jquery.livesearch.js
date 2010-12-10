/*
  liveSearch plugin made by Scott Greenfield with some source taken from John Resig's blog
  *** THIS PLUGIN NEEDS TO BE REWORKED TO BE MORE ABSTRACT ***
  http://www.lyconic.com
  MIT Liscence
*/
jQuery.fn.liveSearch = function(params) {        
  p = $.extend({
    list: '',
    label: '',
    loadingImage: '/images/loading.gif',
    callback: function(){ }
  }, params);
  var list, firstList, label, callback;
  list = $(p.list);
  label = $(p.label);
  firstList = list.html();
  callback = p.callback;

  $.extend($.fn.liveSearch, { //these functions can all be called programatically or overridden
    parseFields: function(){
      var term, primaryTerm, city, state, zip, contactGroup, orgGroup, group, url, parameters;
      primaryTerm = $.trim($('#q').val().toLowerCase());
      term = primaryTerm;
      city = $.trim($('#accounts-search-city').val().toLowerCase());
      state = $.trim($('#accounts-search-state').val().toLowerCase());
      zip = $.trim($('#accounts-search-zip').val().toLowerCase());
      if ($('#accounts-contact-group').length > 0){
        contactGroup = $.trim($('#accounts-contact-group').val().toLowerCase());
      }
      if ($('#accounts-search-organization-group').length > 0){
        orgGroup = $.trim($('#accounts-search-organization-group').val().toLowerCase());
      }
      if (primaryTerm){
        primaryTerm = 'q=' + primaryTerm;
      }else{
        term = 'All Accounts';
      }
      if (city){
        city = '&city=' + city;
      }
      if (state){
        if (state ==='search by state...'){
          state = '';
        }else{
          state = '&state=' + state;
        }
      }
      if (zip){
        zip = '&zip=' + zip;
      }
      if (contactGroup){
        if (contactGroup === 'search contact group...'){
          contactGroup = '';
        }else{
          contactGroup = '&contact_group=' + contactGroup;
        }
        group = contactGroup;
      }
      if (orgGroup){
        if (orgGroup === 'search by organization group...'){
          orgGroup = '';
        }else{
          orgGroup = '&org_group=' + orgGroup;
        }
        group = orgGroup;
      }
      parameters = '&' + primaryTerm + city + state + zip + group;

      url = '/admin/search/accounts?' + parameters;
      if (parameters.length === 0){
        $('#rightColumn #add-all-accounts').fadeOut('fast');
      }else{
        $('#rightColumn #add-all-accounts').fadeIn('fast');
      }
      $.fn.liveSearch.parameters = parameters;
      $.fn.liveSearch.filter(term, url);
    },
    totalRecords: 0,
    parameters: null,
    filter: function(term, url){
      if (term){
        $.ajax({
          beforeSend: function(){
            if (label.length){
              $('#accountsList .page-loading').remove();
              $('#accountsList .current-records').prepend('<div class="page-loading"><img src="/images/loading-big.gif" /></div>');
              label.parent().find('img.account-loading').remove();
              label.empty()
              .append('Search: ' + term)
              .parent()
              .append('<img class="account-loading" src="' + p.loadingImage + '" alt="Loading..." title="Loading..." />');
            }
          },
          cache: false,
          type: 'GET',
          url: url,
          dataType: 'json',
          success: function(data){
            $.fn.liveSearch.totalRecords = data.data.total_entries;
            list.empty().append(data.html);
              var currentRecordsDiv = $('#accountsList .current-records');
              var currentRecordsSpan = currentRecordsDiv.find('.current-records-current')
              var totalRecordsSpan = currentRecordsDiv.find('.current-records-total')
              var currentTotalEntries = $('#allAccounts .account').length;
              var totalEntries = data.data.total_entries;
              currentRecordsSpan.text(currentTotalEntries + ' of ');
              totalRecordsSpan.text(totalEntries);
          },
          complete: function(data){
            label.parent().find('img.account-loading').remove();
            $('#accountsList .page-loading').remove();
            callback();
          }
        });
      }else{
        label.empty().append('All Accounts');
        list.empty().append(firstList);
      }
    }
  });
  
  return this.each(function(i){
    if ($(this).is("input")){
      $(this).keyup(function(e){
        if (e.keyCode != 17 && e.keyCode != 16){ //shift or control were not pushed
          $.fn.liveSearch.parseFields();
        }
      });
    }else{
      $(this).change(function(){
          $.fn.liveSearch.parseFields();
      });
    }
  });

};