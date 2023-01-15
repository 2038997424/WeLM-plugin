import plugin from '../../../lib/plugins/plugin.js'
import common from '../../../lib/common/common.js'
import console from 'console'
import axios from 'axios'
import fs from 'node:fs'
//此插件由[书辞千楪(1700179844)]编写，JD瞎jb乱搞了一下上传的
//模型的prompt文件请放到/Yunzai-Bot/resources/dhdata.txt
//如果没有dhdata.txt文件，请自行在/Yunzai-Bot/resources/内创建"dhdata.txt文件"。
//提问需要再resources里多放个那个wddata.txt
//续写只需加个空的xxdata.txt就行了
//有报错先看这里！！！！！！可能需要npm add axios -w后才能正常使用，看看简介有其他方式
//有问题问JD(1461072722)在上学回复慢，但是一定会回复，也可以去火火的群(666345141)里面找JD


let bot_name = "填这个双引号里面" //你机器人角色昵称or自设之类的?
let API_token = "填这个双引号里面" //你的API-token，没有自己上WeLM官网https://docs.qq.com/form/page/DUW1YVVJNbHpzV2No#/fill-detail申请
let dhcmdstart = "welm" //对话指令开头
let wdcmdstart = "提问" //问答指令开头
let xxcmdstart = "续写" //续写指令开头
let lxdhcmdstart = "lxdh" //连续对话指令开头
let dhreplystart = "(由WeLM回答)" //对话指令回复开头备注, 不用与其他ai区分时可留空
let wdreplystart = "(由WeLM提问)" //问答指令回复开头备注, 不用与其他ai区分时可留空
let xxreplystart = "(由WeLM续写)" //续写指令回复开头备注, 不用与其他ai区分时可留空
let lxdhreplystart = "(又WeLM回答(连续))" //连续对话指令回复开头备注, 不用与其他ai区分时可留空
//模型参数调试专区
let model = "xl"           //要使用的模型名称，当前支持的模型名称有medium、 large 和 xl
let max_tokens = "128"
let max_tokens_xx = "256"    //最多生成的token个数，默认值 16
let temperature = "0.85"   //默认值 0.85，表示使用的
let top_p = "0.65"         //默认值 0.95，来源于nucleus sampling，采用的是累计概率的方式。
let top_k = "0"            //默认值50，从概率分布中依据概率最大选择k个单词，建议不要过小导致模型能选择的词汇少。
let n = "2"                //默认值 1 返回的序列的个数
let stop = "\n"            //默认值 null，停止符号。当模型当前生成的字符为stop中的任何一个字符时，会停止生成。
let twstop = "。"
//分割线_____________________________


export class RGznbot extends plugin {
	constructor() {
		super({
			name: 'WeLM对话',
			event: 'message',
			priority: 60010,
			rule: [
				{
					reg: '^提问.*',
					fnc: 'Wenti',
					log: false
				},
				{
					reg: '^续写.*',
					fnc: 'Xuxie',
				},
				{
					reg: '(.*)',
					fnc: 'Duihua',
					log: false
				},
				{
					reg: '#清除对话',
					fnc: 'Cz',
				},
				{
					reg: '(^lxdh.*)',
					fnc: 'Msg',
					log: false
				},
				{
					reg: "^#填写token(.*)$",
					fnc: 'atk'
				},
				{
					reg: "^#更改name(.*)$",
					fnc: 'op'
				}
			]
		})
	}

	async Duihua(e) {
		//判断一下不是合并消息，不然会报错
		//下面这个random是随机回复群友的消息，这里的概率是1%，如果不想要的话可以把98改成100
		//那个47行的welm是个人用来当做一个100%触发的命令前缀专门用来测试的，可以改成你喜欢的。记得把49行那两个/中间的welm改成你自己的前缀
		if (e.xml || e.img) {
			return false;
		}
		let random_ = parseInt(Math.random() * 99);
		if (random_ >= 98 || random_ <= 0 || e.msg && e.msg?.indexOf(dhcmdstart) >= 0 || !e.isGroup) {
			e.msg = e.msg.replace(dhcmdstart, "")
			let sc_cs = fs.readFileSync('./resources/dhdata.txt', { encoding: 'utf-8' })
			let sc_cs2 = sc_cs + "\n我:" + e.msg + "\n" + bot_name + ":"
			axios({
				method: 'post',
				url: 'https://welm.weixin.qq.com/v1/completions',
				headers: {
					"Content-Type": "application/json",
					"Authorization": API_token
				},
				data: {
					"prompt": sc_cs2,
					"model": model,
					"max_tokens": max_tokens,
					"temperature": temperature,
					"top_p": top_p,
					"top_k": top_k,
					"n": n,
					"stop": stop,
				}
			})
				.then(function (response) {
					console.log(response.data.choices[0]);
					e.reply(dhreplystart + response.data.choices[0].text, e.isGroup);
				})
				.catch(function (error) {
					console.log(error);
				});
		}
	}

	async Wenti(e) {
		e.msg = e.msg.replace(wdcmdstart, "")
		let sc_cs2 = "根据你所学知识回答" + "\n问题:" + e.msg + "\n" + "回答" + ":"
		axios({
			method: 'post',
			url: 'https://welm.weixin.qq.com/v1/completions',
			headers: {
				"Content-Type": "application/json",
				"Authorization": API_token
			},
			data: {
				"prompt": sc_cs2,
				"model": model,
				"max_tokens": max_tokens,
				"temperature": temperature,
				"top_p": top_p,
				"top_k": top_k,
				"n": n,
				"stop": twstop,
			}
		})
			.then(function (response) {
				logger.info('WeLM返回消息:' + response.data.choices[0].text)
				e.reply(wdreplystart + response.data.choices[0].text, e.isGroup);
			})          //如果不需要区分welm与其他ai插件的回复的话可以删掉 | "(welm提问)"+ | 这一部分
			.catch(function (error) {
				console.log(error);
			}
			)
	}

	async Xuxie(e) {
		e.msg = e.msg.replace(xxcmdstart, "")
		axios({
			method: 'post',
			url: 'https://welm.weixin.qq.com/v1/completions',
			headers: {
				"Content-Type": "application/json",
				"Authorization": API_token
			},
			data: {
				"prompt": e.msg,
				"model": model,
				"max_tokens": max_tokens_xx,
				"temperature": temperature,
				"top_p": top_p,
				"top_k": top_k,
				"n": n,
				"stop": stop,
			}
		})
			.then(function (response) {
				logger.info('WeLM返回消息:' + response.data.choices[0].text);
				e.reply(xxreplystart + response.data.choices[0].text, e.isGroup);
			})          //如果不需要区分welm与其他ai插件的回复的话可以删掉 | "(welm提问)"+ | 这一部分
			.catch(function (error) {
				console.log(error);
			}
			)
	}

	async op(e) {
		if (!e.isMaster) {
			e.reply("JD:要是给你填了那我岂不是很没面子")
			return true
		}
		let name = e.msg.replace(/#更改name/g, "").trim();
		let res = fs.readFileSync(`${_path}/plugins/WeLM-plugin/config/config.yaml`, "utf8")

		let str = `${res}`
		var reg = new RegExp(`bot_name: "(.*?)"`);
		var a = str.replace(reg, `bot_name: "${name}"`);
		fs.writeFileSync(`${_path}/plugins/WeLM-plugin/config/config.yaml`, a, "utf8");
		e.reply(`名字已成功修改为${name}`)
	}

	async atk(e) {
		if (e.isGroup || !e.isMaster) {
			e.reply("JD:要是给你在这填了那我岂不是很没面子")
			return true
		}

		let token = e.msg.replace(/#填写token/g, "").trim();
		let token2 = `"${token}"`
		let res = fs.readFileSync(`${_path}/plugins/WeLM-plugin/config/config.yaml`, "utf8")
		let str = `${res}`
		var reg = new RegExp(`"(.*?)"`);
		var a = str.replace(reg, `"${token}"`);
		fs.writeFileSync(`${_path}/plugins/WeLM-plugin/config/config.yaml`, a, "utf8");
		e.reply("开始测试token正确性")
		await common.sleep(1000)
		const settings = await YAML.parse(fs.readFileSync(`${_path}/plugins/WeLM-plugin/config/config.yaml`, 'utf8'));
		let API_token = settings.API_token
		axios({
			method: 'post',
			url: 'https://welm.weixin.qq.com/v1/completions',
			headers: {
				"Content-Type": "application/json",
				"Authorization": API_token
			},
			data: {
				"prompt": "测试",
				"model": "xl",
				"max_tokens": "64",
				"temperature": "0.85",
				"top_p": "0.95",
				"top_k": "50",
				"n": "2",
				"stop": "\n",
			}
		})
			.then(function (response) {
				logger.info('Token已更改为:', `"${token}"`);
				e.reply("token填写成功")
				return true
			})
			.catch(function (error) {
				console.log(error);
				e.reply('token不可用或者无法访问welm，请检查token或网络')
			});
	}

	async Msg(e) {
		//判断一下不是合并消息，不然会报错
		//下面这个random是随机回复群友的消息，这里的概率是1%，如果不想要的话可以把98改成100
		if (e.xml || e.img) {
			return false;
		}
		e.msg = e.msg.replace(lxdhcmdstart, "")
		let xr_mb = "\n我:" + e.msg + "\n" + bot_name + ":"         //如果不想要对话记录写入模型prompt请删除这一行。		
		fs.appendFileSync('./resources/jldata.txt', xr_mb, 'utf8')  //如果不想要对话记录写入模型prompt请删除这一行。
		let sc_cs = fs.readFileSync('./resources/jldata.txt', { encoding: 'utf-8' })
		axios({
			method: 'post',
			url: 'https://welm.weixin.qq.com/v1/completions',
			headers: {
				"Content-Type": "application/json",
				"Authorization": API_token
			},
			data: {
				"prompt": sc_cs,
				"model": model,
				"max_tokens": max_tokens,
				"temperature": temperature,
				"top_p": top_p,
				"top_k": top_k,
				"n": n,
				"stop": stop,
			}
		})
			.then(function (response) {
				logger.info('WeLM返回消息:' + response.data.choices[0].text);
				fs.appendFileSync('./resources/jldata.txt', response.data.choices[0].text, 'utf8')
				e.reply(lxdhreplystart + response.data.choices[0].text, e.isGroup);
			})          //如果不需要区分welm与其他ai插件的回复的话可以删掉 | "(由welm回答)"+ | 这一部分
			.catch(function (error) {
				console.log(error);
				let ys = fs.readFileSync('./resources/dhdata.txt', { encoding: 'utf-8' })
				let xr_mb = ys
				fs.writeFileSync('./resources/jldata.txt', xr_mb, 'utf8')
				e.reply("违反政策的内容或者对话字数已达到上限(2048)，已重置对话，请重新开始")
			});
	}

	async Cz(e) {
		let ys = fs.readFileSync('./resourcesa/dhdata.txt', { encoding: 'utf-8' })
		let xr_mb = ys
		fs.writeFileSync('./resources/jldata.txt', xr_mb, 'utf8')
		e.reply("已清除对话啦")
	}
}

