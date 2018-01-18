$(document).ready(function(){
      function setCookie(name,value,days) {
          var expires = "";
          if (days) {
              var date = new Date();
              date.setTime(date.getTime() + (days*24*60*60*1000));
              expires = "; expires=" + date.toUTCString();
          }
          document.cookie = name + "=" + (value || "")  + expires + "; path=/";
      }

      function getCookie(name) {
          var nameEQ = name + "=";
          var ca = document.cookie.split(';');
          for(var i=0;i < ca.length;i++) {
              var c = ca[i];
              while (c.charAt(0)==' ') c = c.substring(1,c.length);
              if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
          }
          return null;
      }

      function eraseCookie(name) {
          document.cookie = name+'=; Max-Age=-99999999;';
      }

      function randomIntFromInterval(min,max,length)
      {
        var randomArray = [];
        var usedData = getCookie('usedData') ? getCookie('usedData').split(",") : [];
        while(randomArray.length < length){
          var random = Math.floor(Math.random()*(max-min+1)+min);
          while(usedData.indexOf(random) > -1) {
            random = Math.floor(Math.random()*(max-min+1)+min);
          }
          usedData.push(random);
          randomArray.push(random);
        };
        setCookie('usedData',usedData.join(","),7);
        return randomArray;
      }

      $.getJSON("./src/lib/data.json", function(data) {
          var quizList = randomIntFromInterval(0,1000,20);
          var score = 0;
          quizList.map((i,index) => {
             var quistion = data[i];
             console.log(quistion);
             $("#quizList").append(
               "<section class='item' data-answer='" + (quistion.answer - 1) + "'>" +
                "<h2 class='question'>" + (index + 1) + "."+ quistion.quiz + "</h2>" +
                "<ul class='options'><li class='option' >A. " + quistion.options[0]+ "</li>" +
                "<li class='option' >B. " + quistion.options[1]+ "</li>" +
                "<li class='option' >C. " + quistion.options[2]+ "</li>" +
                "<li class='option' >D. " + quistion.options[3]+ "</li></ul>" +
              "</section>"
            );
          });

          $("#quizList").append(
              "<section class='item'>" +
              "<h2 class='side-slide'>得分: <span class='final-score'>"+ 0 +"</span>分</h2>" +
              "</section>"
          );

          var countdownOpt = {
              "start": false,
              "animation": "smooth",
              "bg_width": 1.2,
              "fg_width": 0.1,
              "total_duration": 16,
              "circle_bg_color": "#60686F",
              "time": {
                  "Days": {
                      "show": false
                  },
                  "Hours": {
                      "show": false
                  },
                  "Minutes": {
                      "show": false
                  },
                  "Seconds": {
                      "text": "Seconds",
                      "color": "#FFCC66",
                      "show": true
                  }
                }
          };

          $(".countdown").TimeCircles(countdownOpt).addListener(countdownComplete);

          function countdownComplete(unit, value, total){
              if(total<=0){
                $(".countdown").TimeCircles(countdownOpt).stop();
              }
          };

          Reveal.initialize();

          $('body').on('keypress', function(e) {
              console.log(e.keyCode);
              if (e.keyCode == 13 || e.which == 13) {
                  if(!Reveal.isFirstSlide()&&!Reveal.isLastSlide()){
                    showAnswer();
                  }
              }

              if (e.keyCode == 61 || e.which == 61) {
                  score++;
                  $(".score-container .score").html(score);
              }

              if (e.keyCode == 45 || e.which == 45) {
                  score--;
                  $(".score-container .score").html(score);
              }
          });

          $('body').on('keyup', function(e) {
              if (e.keyCode == 13 || e.which == 13) {
                  if(!Reveal.isFirstSlide()&&!Reveal.isLastSlide()){
                    Reveal.next();
                  }
              }
          });

          Reveal.addEventListener( 'slidechanged', function( event ) {
            if(Reveal.isLastSlide()){
                $(".score-container").hide();
                $(".final-score").html(score);
                $(".countdown").TimeCircles().end().fadeOut('slow').replaceWith("<h4>游戏结束</h4>");
            }else if(!Reveal.isFirstSlide()){
                $(".countdown").TimeCircles().restart();
            }
          });

          function showAnswer(){
            var currentSlide = Reveal.getCurrentSlide();
            var answer = currentSlide.getElementsByClassName("option")[currentSlide.dataset.answer];
            answer.className = answer.className + " " + "correct-answer";
          }
      });

 });
