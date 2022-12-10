# 云崽自定义对话WELM

#### 介绍
此为Yunzai-Bot云崽QQ机器人的插件，需要依赖云崽机器人来实现功能，可以模仿你机器人的人设对话(或许有其他问答功能) _可以去这里研究一下_ [WeLM](https://welm.weixin.qq.com/docs/api/)

# 安装教程
### 第一步
第一步需要在插件内改上你申请的token _去这个文档申请_ [WeLM申请文档](https://docs.qq.com/form/page/DUW1YVVJNbHpzV2No#/fill-detail)
### 第二步
第二步需要在dhdata.txt内写入预设，预设内第1行输入给模型的提示信息，然后回车空一行，接下来写一段模拟的对话。强烈建议去看看去看那个dhdata.txt演示学习一下，如果再不理解可以到渔火的群蒙德幼儿园找一个叫"群傻逼时不时来问问题喵~"的人问一下。
#### 或者
(如果你机器人也是纳西妲的话可以把"(JD自用演示)"直接删了放到/Yunzai-Bot/resources/下面开用(强烈建议自己研究下，我用的这个对话起来bug很多))
## 开始
在对话前面加个welm的100%触发指令(可自行更改看43行的注释)然后就可以与开始激情对话了。

## 使用说明
第一次使用可能会缺少依赖，执行

```
pnpm add axios -w
```
即可解决
#### 如果装了@戏天的那个ai自定义的js的
需要去那个ai插件里面的104行加上

```

    //放行welm测试指令
    if(e.msg.includes("welm")){
	return false
    }
```
这个100%触发指令可以到WeLM.js的第47行修改(42行有注释)
![输入图片说明](%E4%BA%91%E5%B4%BD%E8%87%AA%E5%AE%9A%E4%B9%89%E5%AF%B9%E8%AF%9DWeLM-43a1cc21ed0ab5ef.jpg)

# 效果
巨久之前测试的，那时候无需100%触发指令，现在要，放这个单纯为了表扬一下WeLM和装个逼 :smirk: 
![输入图片说明](%E4%BA%91%E5%B4%BD%E8%87%AA%E5%AE%9A%E4%B9%89%E5%AF%B9%E8%AF%9DWeLM506f1a205423787.png)