/* www.xin-shu.com */
var gaodu=window.innerHeight;
var Tgaodu=window.innerWidth*2.3055;
var Cgaodu=-(Tgaodu-gaodu);
var Hgaodu=-(Tgaodu-gaodu)-20;

function jiazai(){
	document.getElementById("jiazai").style.display="none";
}

var xinshuc=0;
var xinshui=0;
var xinshuq=1;
var hudpd=0;
var cumy1,cumyt;


function xinshup() 
{
	if(xinshuc>0 && xinshuq==1)
	{
		xinshuc=xinshuc-5;
		document.getElementById("touping").style.top=xinshuc+"px";
		setTimeout("xinshup()",10);
	}
	else if(xinshuc<Cgaodu && xinshuq==1)
	{
		xinshuc=xinshuc+5;
		document.getElementById("touping").style.top=xinshuc+"px";
		setTimeout("xinshup()",10);
	}
	
}

function huaf(chumodian)
{
	chumodian.preventDefault();
	xinshuq=0;
	cumy1=chumodian.changedTouches[0].pageY;
	cumyt=xinshuc;
	
}


	 
function huad(chumodian)
{
	chumodian.preventDefault();
	var huadd=(chumodian.changedTouches[0].pageY-cumy1);
	xinshuq=0;
	if  ( (huadd>3 || huadd<-3) && (xinshuc<149 && xinshuc>Hgaodu ) )		
	{
		xinshuc=cumyt+huadd;
		if( xinshuc>0 && xinshuc<376)
		{
			xinshuc=-((xinshuc-367.423)/30)*((xinshuc-367.423)/30)+150;
		}
		document.getElementById("touping").style.top=xinshuc+"px";
	}
}


function huaq(chumodian)
{
	chumodian.preventDefault();
	xinshuq=1;
	xinshup();
	
} 


document.addEventListener("touchstart",huaf,false); 
document.addEventListener("touchmove",huad,false); 
document.addEventListener("touchend",huaq,false); 
