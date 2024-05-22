/**
 * jspsych-html-slider-response
 * a jspsych plugin for free response survey questions
 *
 * Josh de Leeuw
 *
 * documentation: docs.jspsych.org
 *
 */


jsPsych.plugins['html-vas-custom'] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'html-slider-response',
    description: '',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Stimulus',
        default: undefined,
        description: 'The HTML string to be displayed'
      },


      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Continue',
        array: false,
        description: 'Label of the button to advance.'
      },
      require_movement: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Require movement',
        default: false,
        description: 'If true, the participant will have to move the slider before continuing.'
      },

      stimulus_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Stimulus duration',
        default: null,
        description: 'How long to hide the stimulus.'
      },
      trial_duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Trial duration',
        default: null,
        description: 'How long to show the trial.'
      },
      response_ends_trial: {
        type: jsPsych.plugins.parameterType.BOOL,
        pretty_name: 'Response ends trial',
        default: true,
        description: 'If true, trial will end when user makes a response.'
      },
    }
  }

  plugin.trial = function(display_element, trial) {

    var html = '<div id="jspsych-html-slider-response-wrapper" style="margin: 0px 0px;">';
    html += '<div id="jspsych-html-slider-response-stimulus">' + trial.stimulus + '</div>';



    html += '</div>';


    // add submit button
    html += '<button id="jspsych-html-slider-response-next" class="jspsych-btn" '+ (trial.require_movement ? "disabled" : "") + '>'+trial.button_label+'</button>';

    display_element.innerHTML = html;

    // Custom VAS v.2
    var cs2 = document.getElementById("customSlider2");
    var ct2 = document.getElementById("customTick2");
    var ct2_fig = document.getElementById("customTick2_fig");
    var cv2 = document.getElementById("mySlider5_value");
    cs2.addEventListener("click", clickScale);        // for desktops
    cs2.addEventListener("touchstart", clickScale);   // for phones
    ct2.addEventListener("click", clickMarker);       // for desktops
    ct2.addEventListener("touchstart", clickMarker);  // for phones
    var customRating2 = 0;

    function clickScale(e) {processClick2(e.offsetX)};
    function clickMarker(e) {processClick2(e.offsetX + ct2.offsetLeft);}
    function processClick2(clickX) {
     //debugger;
     // align the thumb with the middle of the scale - could be outside this function,
     // but then weird behavior upon refresh with F5 (?)
     ct2.style.top = cs2.height/2 - ct2_fig.height/2 + "px";
     // make sure the click is within the scale range
     if (clickX < 0) clickX = 0;
     if (clickX > cs2.width) clickX = cs2.width;
     // show the marker
     ct2.style.display = "inline";
     ct2.style.left = clickX - ct2_fig.width/2 + "px";
     customRating = Math.round(clickX / cs2.width * 100);
     cv2.innerHTML = customRating;
     vas_rating=customRating
     // console.log("updated vas rating",vas_rating);
     document.querySelector('#jspsych-html-slider-response-next').disabled = false;//enable button to continue
    }


    var response = {
      rt: null,
      response: null
    };

    // if(trial.require_movement){
    //   display_element.querySelector('#jspsych-html-slider-response-response').addEventListener('change', function(){
    //     display_element.querySelector('#jspsych-html-slider-response-next').disabled = false;
    //   })
    // }


    display_element.querySelector('#jspsych-html-slider-response-next').addEventListener('click', function() {
      // measure response time
      var endTime = performance.now();
      response.rt = endTime - startTime;
      // response.response = display_element.querySelector('#jspsych-html-slider-response-response').value;

      if(trial.response_ends_trial){
        end_trial();
      } else {
        display_element.querySelector('#jspsych-html-slider-response-next').disabled = true;
      }

    });

    function end_trial(){

      jsPsych.pluginAPI.clearAllTimeouts();

      // save data
      var trialdata = {
        "rt": response.rt,
        // "response": response.response,
        "stimulus": trial.stimulus
      };

      display_element.innerHTML = '';

      // next trial
      jsPsych.finishTrial(trialdata);
    }

    if (trial.stimulus_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        display_element.querySelector('#jspsych-html-slider-response-stimulus').style.visibility = 'hidden';
      }, trial.stimulus_duration);
    }

    // end trial if trial_duration is set
    if (trial.trial_duration !== null) {
      jsPsych.pluginAPI.setTimeout(function() {
        end_trial();
      }, trial.trial_duration);
    }

    var startTime = performance.now();
  };

  return plugin;
})();
