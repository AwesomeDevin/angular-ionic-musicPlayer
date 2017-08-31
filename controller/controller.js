var myCtrl = angular.module('myController', []);

myCtrl.controller('listCtrl', ['$scope', '$http', '$ionicLoading', '$rootScope', '$state', function($scope, $http, $ionicLoading, $rootScope, $state) {
    var idarr = [];
    $ionicLoading.show();
    $http.get('json/list.json').success(function(data) {
        $scope.topics = data;
        console.log($scope.topics);
        var num = 0;
        for (var i in data) {
            (function(i) {
                idarr.push(data[i].id);
                var j = 0;
                $scope.topics[i].goods = [];

                $http.get("http://route.showapi.com/213-4?showapi_appid=27358&showapi_sign=adf001f4812b48d192763c9d734a8543&topid=" + data[i].id)
                    .success(function(data) {
                        if (data && data.showapi_res_code == 0) {
                            console.log(data);
                            num++;
                            console.log(num,$scope.topics.length);
                            $scope.topics[i].goods = data.showapi_res_body.pagebean.songlist.slice(0, 3);
                            if (num == 8) {
                                $ionicLoading.hide();
                            }

                        } else if (data.showapi_res_code != 0 && num == 0) {
                            $ionicLoading.hide();
                            $ionicLoading.show({
                                template: '请求超时,清除缓存再试试哦',
                                duration: 4000
                            });
                        }
                    })
            })(i)

        }

        $scope.Todetail = function(j, str) {
            // localStorage.setItem("sing_id",j);
            // localStorage.setItem("topic_name",str);
            $rootScope.singid = j;
            $rootScope.topicname = str;
            $state.go('detail');
            sessionStorage.removeItem("detail_data");
        }

    })


    // var btns = document.getElementsByTagName('button');

    // for (var i = 0; i < ) {

    // 	(function(i) {

    // 	})(i)

    // 	btns[i].index = i;
    // 	btns[i].onclick = function() {
    // 		console.log(this.index);
    // 	}
    // }

    // $scope.getdate=function(i,arr){
    // 	$http.get("http://route.showapi.com/213-4?showapi_appid=27358&showapi_sign=adf001f4812b48d192763c9d734a8543&topid="+idarr[i]+"")
    // 		.success(function(data){

    // 			flag=true;
    // 			arr.push(data.showapi_res_body.pagebean.songlist.slice(0,3));

    // 			i++;
    // 			console.log(i,arr);
    // 			if(i==idarr.length)
    // 			{
    // 				return;
    // 			}
    // 			$scope.getdate(i,arr);

    // 		})
    // }






    // $http.post('http://route.showapi.com/213-4',{
    // 	params:{
    // 		showapi_appid:"26477",
    // 		showapi_sign:"b46deb6701d744538c75b724ec3dc585",
    // 		topid:"3"

    // 	}
    // }).success(function(data){
    // 	console.log(data);
    // })





}])




myCtrl.controller('detailCtrl', ['$scope', '$http', '$rootScope', '$sce', function($scope, $http, $rootScope, $sce) {

    // console.log($rootScope.singid);

    // $scope.singid=localStorage.getItem("sing_id");
    // $scope.topicname=localStorage.getItem("topic_name");
    // console.log($scope.topicname);
    $scope.data = JSON.parse(sessionStorage.getItem("detail_data"));
    // console.log($scope.data);
    // 播放

    $scope.playall=function(){
        console.log($scope.data[0]);
        sessionStorage.setItem("play_data",JSON.stringify($scope.data[0]));
    }
    $scope.play = function(obj) {

        sessionStorage.removeItem("play_data");
        // $rootScope.obj=obj;
        // console.log(obj);
        sessionStorage.setItem("play_data", JSON.stringify(obj));
    }
    if ($scope.data) {
        // $scope.data=olddata;
        // console.log("数据已经存在")
        return;
    }

    $http.get("http://route.showapi.com/213-4?showapi_appid=27358&showapi_sign=adf001f4812b48d192763c9d734a8543&topid=" + $rootScope.singid)
        .success(function(data) {
            if (data && data.showapi_res_code == 0) {



                $scope.data = data.showapi_res_body.pagebean.songlist.slice(0, 100);
                // console.log($scope.data);
                sessionStorage.setItem("detail_data", JSON.stringify($scope.data));
            } else {
                console.log("请求超时");
                return;
            }
        })




}])








myCtrl.controller('playCtrl', ['$scope', '$http', '$rootScope', '$interval', '$sce', '$ionicPopup','$ionicScrollDelegate',
    function($scope, $http, $rootScope, $interval, $sce, $ionicPopup,$ionicScrollDelegate) {

        $scope.obj = JSON.parse(sessionStorage.getItem("play_data"));
        if (!$scope.obj) {
            return;
        }
        $scope.total_times="00:00";
        $scope.current_time="00:00";
        $scope.listflag=false;
         var oaudio = document.getElementById('music_play');
        // console.log($scope.obj);
        // $scope.total_times = parseFloat($scope.obj.seconds)
        // console.log($scope.total_times);


        $scope.height=document.getElementsByClassName('playing')[0].offsetHeight ;
        console.log($scope.height);
        $scope.Settotaltime=function(){
             var tminute = parseInt($scope.total_times / 60);
            // console.log(tminute);
            var tsecond = $scope.total_times % 60;
            tsecond = tsecond < 10 ? "0" + tsecond : tsecond;
            tminute = tminute < 10 ? "0" + tminute : tminute;
            $scope.total_time = tminute + ":" + tsecond;

           
            // console.log("置0");
            var minute = parseInt($scope.current_times / 60);
            var second = parseInt($scope.current_times % 60);
            if (second < 10) {
                $scope.current_time = "0" + minute + ":0" + second;
            } else {
                $scope.current_time = "0" + minute + ":" + second;
            }
        }
       




        // if($scope.current_time<10)
        // {
        // 	$scope.current_time="00:0"+$scope.current_time;
        // }
        // else
        // {
        // 	var minute=parseInt($scope.current_time/60);
        // 	var second=parseInt($scope.current_time%60);
        // 	if(second<10)
        // 	{
        // 		$scope.current_time=minute+":0"+second;
        // 	}
        // 	else
        // 	{
        // 		$scope.current_time=minute+":"+second;
        // 	}
        // }



        // 开始播放
        $scope.start_play = function() {

             if ($scope.current_times == $scope.total_times) {
                $scope.current_times=0;
             }
            $interval.cancel($scope.timer);
            $scope.timer = $interval(function() {
              
              // console.log($scope.current_times,$scope.total_times);
                if ($scope.current_times >= $scope.total_times) {
                    // $interval.cancel($scope.timer);
                    console.log(1);
                      console.log($scope.autoChangeSong());
                     if($scope.autoChangeSong())
                     {
                       
                        $scope.resert_play($scope.autoChangeSong());
                    }
                    else
                    {
                       return;
                    }
                }
                var minute = parseInt($scope.current_times / 60);
                var second = parseInt($scope.current_times % 60);

                if (second < 10) {
                    $scope.current_time = "0" + minute + ":0" + second;
                } else {

                    $scope.current_time = "0" + minute + ":" + second;
                }

                var nowwith = parseFloat($scope.current_times) / parseFloat($scope.total_times);
                $scope.current_width = {
                    "width": nowwith * 100 + "%"
                }





            }, 1000);
        }

        // 获取音频对象



        //自动切歌
        $scope.autoChangeSong=function(){
             for(var i in  $scope.data_s)
             {
                if($scope.data_s[i].songid==$scope.obj.songid)
                {
                   if(i!=$scope.data_s.length-1)
                   {

                    // console.log(i,(parseInt(i)+1),$scope.data_s[i],$scope.data_s[parseInt(i)+1]);
                    return $scope.data_s[parseInt(i)+1];
                   }
                   else
                   {
                    return $scope.data_s[i];
                   }
                }
             }
        }

        $scope.jumpLast=function(){

            for(var i in  $scope.data_s)
             {
                if($scope.data_s[i].songid==$scope.obj.songid)
                {
                    console.log(i);   
                   if(i!= 0)
                   {
                    // console.log(i,(parseInt(i)+1),$scope.data_s[i],$scope.data_s[parseInt(i)+1]);
                    $scope.resert_play( $scope.data_s[parseInt(i)-1]);
                    return;
                   }
                   else
                   {
                    $scope.resert_play( $scope.data_s[i]);
                    return;
                   }
                }
             }
        }

        $scope.jumpNext=function(){

            for(var i in  $scope.data_s)
             {
                if($scope.data_s[i].songid==$scope.obj.songid)
                {
                    console.log(i);  
                   if(i!= $scope.data_s.length-1)
                   {
                    // console.log(i,(parseInt(i)+1),$scope.data_s[i],$scope.data_s[parseInt(i)+1]);
                    $scope.resert_play( $scope.data_s[parseInt(i)+1]);
                    return;
                   }
                   else
                   {
                    $scope.resert_play( $scope.data_s[i]);
                    return;
                   }
                }
             }
        }

       




        // 切歌重置播放器
        $scope.resert_play = function(newobj) {
            sessionStorage.setItem("play_data", JSON.stringify(newobj));
            $scope.current_times = 0;
            $scope.newobj = JSON.parse(sessionStorage.getItem("play_data"));
            $scope.obj = $scope.newobj;
            // $scope.total_times = parseFloat($scope.obj.seconds)
            var tminute = parseInt($scope.total_times / 60);
            // console.log(tminute);
            var tsecond = $scope.total_times % 60;
            tsecond = tsecond < 10 ? "0" + tsecond : tsecond;
            tminute = tminute < 10 ? "0" + tminute : tminute;
            $scope.total_time = tminute + ":" + tsecond;
            $scope.close_list();
             $scope.no_play();
            $scope.get_songtxt();
            
        }








        // 停止播放
        $scope.no_play = function() {
            $interval.cancel($scope.timer);
            $scope.isok = true;
        }


        $rootScope.getsrc = function(url) {
            return $sce.trustAsResourceUrl(url);
        }



      
        $scope.data_s = JSON.parse(sessionStorage.getItem("detail_data"));   //session中是否存在detail_data数据
        if (!$scope.data_s) {
          return;
        } else {
            console.log(  $scope.data_s);
        }
        // console.log($scope.autoChangeSong());

         $scope.data_slength= $scope.data_s.length;
        // 关闭歌单
        $scope.close_list = function() {
             $scope.listflag=false;
            var olist = document.getElementById("sing_list");
            startMove(olist, { "bottom": -800 }, function() {
                olist.style.display="none";
            });
            // console.log(1,olist);

        }

        // 打开歌单
        $scope.open_list = function() {
                 $scope.listflag=true;
                var olist = document.getElementById("sing_list");
                olist.style.display="block";
                startMove(olist, { "bottom": 0 }, function() {});
                // console.log(1,olist);

            }
            // 一个提示对话框
        $scope.showAlert = function() {
            var alertPopup = $ionicPopup.alert({
                title: '提示',
                template: '亲 请求超时了哦 请重试',
                buttons: [{ "text": '确认', type: 'button-positive' }]
            });

        };



        // 处理歌词
        // $scope.deal = function(str) {
        //     var Str = str.split(" ");
        //     return Str;
        // }
         $scope.deal = function(arr) {
         	var newarr=[]
           for(var i=0;i<arr.length;i++)
           {
           		var index=arr[i].indexOf("]");
           		
           		var newarr_part=arr[i].slice(index+1,arr.length-1);
           		newarr.push(newarr_part);
           }
            // console.log(newarr);
           return newarr;
        }



        // 获得歌词的时间
        $scope.gettime=function(arr){
        	var newarr=[]
        	
           for(var i=0;i<arr.length;i++)
           {    
            // console.log(arr[i],arr[i].length);
                if(arr[i].length<=10)
                {
                   continue;
                }
           		var index1=arr[i].indexOf("[");
           		var index2=arr[i].indexOf(".");
           		
           		arr[i]=arr[i].slice(index1+1,index2);

           		var index3=arr[i].indexOf(":");
                var minute=arr[i].slice(0,index3);
                var second=arr[i].slice(index3+1);
                var sum=parseFloat(minute*60)+parseFloat(second);
                newarr.push(sum);
           }
          
           return newarr;
        }



        // 获得歌词
     
       
        $scope.get_songtxt = function() {
            $http.get("http://route.showapi.com/213-2?showapi_appid=27358&showapi_sign=adf001f4812b48d192763c9d734a8543&musicid=" + $scope.obj.songid)
                .success(function(data) {
                    if (data && data.showapi_res_code == 0) {
                    	// console.log(data.showapi_res_body.lyric);

                      


                    	var lyric = data.showapi_res_body.lyric;


                    	lyric = lyric.replace(/&#58;/g, ':')
                    		.replace(/&#32;/g, ' ')
                    		.replace(/&#45;/g, '-')
                    		.replace(/&#39;/g, '\'')
                    		.replace(/&#40;/g, '(')
                    		.replace(/&#41;/g, ')')
                            .replace(/&#43;/g, '+')
                    		.replace(/&#46;/g, '.');

                    	// console.log(lyric);

                    	 lyric = lyric.split('&#10;');
                    	 lyric.splice(0,5);
                    	// console.log(lyric);

                        oaudio.play();
                        $scope.start_play();
                        
                        // console.log(data.showapi_res_body.lyric_txt);
                        $scope.isok = true;
                        $scope.song_pretxt = $scope.deal(lyric);

                          if (oaudio.paused)
                        {
                             $scope.isok = false;
                        }
                        // 对歌词的空格进行处理
                        $scope.handle=function(){
                        	 $scope.song_txt=[];
                        	for (var i = 0; i < $scope.song_pretxt.length; i++) {
	                            // console.log($scope.song_pretxt[0]);
	                            if ($scope.song_pretxt[i] == "") {
	                                continue;
	                            } else {
	                            	var obj = {
	                            		'text': $scope.song_pretxt[i]
	                            	};
	                                $scope.song_txt.push(obj);
	                            }
	                            // console.log($scope.song_txt.length);
                        	}
                        }
                       
                       
                       
                       $scope.handle();

                        // 点击播放按钮
                        $scope.change_play = function() {
                            if (oaudio.paused) {
                                oaudio.play();
                                $scope.start_play();
                                $scope.isok = true;
                            } else {
                                oaudio.pause();
                                $scope.no_play();
                                $scope.isok = false;
                            }
                        }
                        // console.log(lyric);
                        $scope.txt_time=$scope.gettime(lyric);
                        // console.log( $scope.txt_time);
                         // console.log( $scope.song_txt);

                        $scope.gaoliang();   //开始高亮;

                    } else {
                        $scope.showAlert();
                        return;
                    }
                })
        }



        $scope.get_songtxt();



         // 歌词高亮
        $scope.gaoliang=function(){

        	$scope.current_play=false;
        	// 获取当前时间 
   //      	var aud = document.getElementById("music_play");
   //      	aud.ontimeupdate = function() {myFunction()}
   //      	function myFunction() {
			
			//     console.log(aud.currentTime);
			// }
            // console.log( $scope.song_txt);

            renderLyric(  $scope.txt_time);
			
        	
        }



       

            $scope.clickbody=function(){
                
               if($scope.listflag==true)
               {
                $scope.close_list();
               }
           
            }
        
       

          function renderLyric(lrcObj) {
        // lyric.innerHTML = '';
       console.log('---');
        var lyricLineHeight = $scope.height;
        var k = 0;
       oaudio.lyric = {};
        // console.log(lrcObj);
        for (var i in lrcObj) {
            var k = lrcObj[i];
            // if (!txt) {
            //     continue;
            // }
           oaudio.lyric[k] = {
                index: i++,
               
                top: i * lyricLineHeight
            };
           
        }
       oaudio.addEventListener('timeupdate', updateLyric);
     
    }

    function updateLyric() {

        var data =oaudio.lyric;
        var currentTime = Math.round(this.currentTime);
        $scope.current_times=currentTime;
        $scope.total_times=parseInt(oaudio.duration);
        // console.log($scope.total_times);
        // console.log($scope.current_times,$scope.total_times);
         $scope.Settotaltime();
        var lrc = data[currentTime];
        // console.log(lrc);
        if (!lrc) return;
        // var text = lrc.text;
        // console.log(text);
        locationLrc(lrc);

        function locationLrc(lrc) {

            $('.gc ul .playing').removeClass('nowplay');
            $('.gc ul li').eq(lrc.index).addClass('nowplay');
            $ionicScrollDelegate.$getByHandle('list').scrollTo(0, lrc.top-200, true);
        }
    }


       

    }
])






























// 搜索控制器

myCtrl.controller('searchCtrl', ['$scope', '$http', '$rootScope', '$sce','$ionicPopup','$ionicLoading','$state', function($scope, $http, $rootScope, $sce,$ionicPopup,$ionicLoading,$state) {
    $scope.totalnum=[];
   $scope.load_show=false;
   $scope.Load_more=function(){
         $scope.load_show=true;
        
         $scope.start_search( parseInt($scope.currentpage)+1);
         console.log( $scope.currentpage);
   }
    $scope.focus=function(){
        $scope.show=true;   
    }

    $scope.blur=function(){
        $scope.show=false;
        $scope.totalnum="";
        $scope.search.txt="";

    }
    $scope.search={
        txt:''
    }
    $scope.Searching=function(e){
        e=e||event
        if(e.keyCode==13)
        {
            $scope.tap_search(1);

        }
    }

     $scope.showheader=false;

     $scope.asd=function(){
        console.log(1);
     }

     $scope.tap_search=function(i){
        $ionicLoading.show();
        $scope.text=$scope.search.txt;
        $scope.currentpage=i;

        $http.get("http://route.showapi.com/213-1?showapi_appid=27358&showapi_sign=adf001f4812b48d192763c9d734a8543&keyword=" + $scope.text+"&page="+$scope.currentpage)
        .success(function(data){
           if(data&&data.showapi_res_code==0)
           {
                 $scope.load_show=true;
                $ionicLoading.hide();
                $scope.totaldata=data.showapi_res_body.pagebean;
                $scope.totalnum=data.showapi_res_body.pagebean.contentlist;
                 $scope.$broadcast('scroll.infiniteScrollComplete');
                // console.log( $scope.totaldata,$scope.totalnum);
                 if( $scope.totalnum.length==0)
                {
                     $scope.showAlert1();
                     return;
                }
                if($scope.totalnum[0].singername==$scope.text)    //判断是否显示专辑名片
                {
                    $scope.showheader= true;
                }
                // console.log($scope.totaldata.contentlist[0].albumpic_small,$scope.text)


           }
           else
           {
                $ionicLoading.hide();
                $scope.showAlert();
           }
        })
     }



    $scope.start_search=function(i){
        $ionicLoading.show();
        $scope.text=$scope.search.txt;
        $scope.currentpage=i;

        $http.get("http://route.showapi.com/213-1?showapi_appid=27358&showapi_sign=adf001f4812b48d192763c9d734a8543&keyword=" + $scope.text+"&page="+$scope.currentpage)
        .success(function(data){
           if(data&&data.showapi_res_code==0)
           {
                 $scope.load_show=true;
                $ionicLoading.hide();
                $scope.totaldata=data.showapi_res_body.pagebean;
                $scope.totalnum=$scope.totalnum.concat(data.showapi_res_body.pagebean.contentlist);
                 $scope.$broadcast('scroll.infiniteScrollComplete');
                // console.log( $scope.totaldata,$scope.totalnum);
                 if( $scope.totalnum.length==0)
                {
                     $scope.showAlert1();
                     return;
                }
                if($scope.totalnum[0].singername==$scope.text)    //判断是否显示专辑名片
                {
                    $scope.showheader= true;
                }
                // console.log($scope.totaldata.contentlist[0].albumpic_small,$scope.text)


           }
           else
           {
                $ionicLoading.hide();
                $scope.showAlert();
           }
        })
    }



     $scope.showAlert = function() {
            var alertPopup = $ionicPopup.alert({
                title: '提示',
                template: '亲 请求超时了哦 请重试',
                buttons: [{ "text": '确认', type: 'button-positive' }]
            });

        };


     $scope.showAlert1 = function() {
            var alertPopup = $ionicPopup.alert({
                title: '提示',
                template: '亲 你要搜的歌曲不存在喔',
                buttons: [{ "text": '确认', type: 'button-positive' }]
            });

        };
    


    // 播放
    $scope.search_play=function(obj){
        sessionStorage.setItem("play_data", JSON.stringify(obj));
         sessionStorage.setItem("detail_data", JSON.stringify($scope.totalnum));
        // console.log(obj);
        // $scope.showerror();
        $state.go("play");
    }




     $scope.showerror = function() {
            var alertPopup = $ionicPopup.alert({
                title: '提示',
                template: '<p type="text-align:center;">后台接口数据不全<br/>此处仅限显示数据<br/>请谅解</p>',
                buttons: [{ "text": '确认', type: 'button-assertive' }]
            });

        };


}])


