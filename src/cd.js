require('./c')
require('./d')
require('./style/common.css')

console.log('this is cd.js . that require c.js and d.js.');

let words = "仿佛有痛楚。如果我晕眩，那是因为幻觉丰盛，能量薄弱。足以支持我对你的迷恋，不够支持我们的的快乐。烟花飞腾的时候，火焰掉入海中。遗忘就和记得一样，是送给彼此最好的纪念。爱从来都不是归宿，也不是我们彼此的救赎。";

transWord(document.getElementById('t2'), words);

function transWord(dom, str)
{
	var offsetHeight = dom.offsetHeight;

	for(var i = 0; i < str.length; i ++)
	{
		dom.innerHTML = str.substr(0, i);

		if(dom.scrollHeight > offsetHeight)
		{
			dom.innerHTML = str.substr(0, i - 3) + '…';
			break;
		}
	}
	dom.setAttribute("title", str);
}