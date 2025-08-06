import { pop } from 'svelte-highlight/styles';
import { writable } from 'svelte/store';

export let initialModels = [
	// Updated from Ollama search data
	{
		name: 'GPT-OSS',
		image: 'gpt-oss:latest',
		context: 128000,
		parameters: '20b',
		versions: [
			{parameters:'20b', size: 14000, context: 128000, input: ['text'], isLatest: true}, 
			{parameters:'120b', size: 65000, context: 128000, input: ['text']}
		],
		icon: 'openai.svg',
		size: 4.9,
		tags: ['tools', 'thinking'],
		description: `OpenAI's open-weight models designed for powerful reasoning, agentic tasks, and versatile developer use cases.`,
		installed: false,
		popularity: 135200,
		fav: false,
		className: 'openai'
	},
	{
		name: 'DeepSeek-R1',
		image: 'deepseek-r1:latest',
		context: 128000,
		parameters: '8b',
		versions: [
			{parameters:'1.5b', size: 1150, context: 128000, input: ['text']}, 
			{parameters:'7b', size: 4700, context: 128000, input: ['text']}, 
			{parameters:'8b', size: 5200, context: 128000, input: ['text'], isLatest: true}, 
			{parameters:'14b', size: 9000, context: 128000, input: ['text']}, 
			{parameters:'32b', size: 20000, context: 128000, input: ['text']}, 
			{parameters:'70b', size: 43000, context: 128000, input: ['text']}, 
			{parameters:'671b', size: 404000, context: 128000, input: ['text']}
		],
		icon: 'deepseek.svg',
		size: 5.2,
		tags: ['tools', 'thinking'],
		description: `DeepSeek-R1 is a family of open reasoning models with performance approaching that of leading models, such as O3 and Gemini 2.5 Pro. Significantly improved reasoning and inference capabilities.`,
		installed: false,
		popularity: 56100,
		fav: false,
		className: 'deepseek'
	},
	{
		name: 'Llama3.1',
		image: 'llama3.1:latest',
		context: 128000,
		parameters: '8B',
		versions: [
			{parameters:'8b', size: 4900, context: 128000, input:['text'], isLatest: true}, 
			{parameters:'70b', size: 43000, context: 128000, input: ['text']}, 
			{parameters:'405b', size: 243000, context: 128000, input: ['text']}
		],
		icon: 'llama.svg',
		size: 4.9,
		tags: ['chat', 'text', 'reasoning', 'tools'],
		description: `Llama 3.1 is a new state-of-the-art model from Meta available in 8B, 70B and 405B parameter sizes. The upgraded versions are multilingual and have a significantly longer context length of 128K, state-of-the-art tool use, and overall stronger reasoning capabilities.`,
		installed: false,
		popularity: 99400,
		fav: false,
		className: 'llama'
	},
	{
		name: 'Gemma3',
		image: 'gemma3:latest',
		context: 128000,
		parameters: '4B',
		versions: [
			{parameters:'1b', size: 815, context: 32000, input: ['text']}, 
			{parameters:'4b', size: 3300, context: 128000, input: ['text', 'image'], isLatest: true}, 
			{parameters:'12b', size: 8100, context: 128000, input: ['text', 'image']}, 
			{parameters:'27b', size: 17000, context: 128000, input: ['text', 'image']}
		],
		icon: 'gemma.svg',
		size: 3.3,
		tags: ['chat', 'text', 'vision', 'multimodal'],
		description: `The current, most capable model that runs on a single GPU. Gemma 3 models are multimodal—processing text and images—and feature a 128K context window with support for over 140 languages.`,
		installed: false,
		popularity: 10800,
		fav: false,
		className: 'gemma'
	},
	{
		name: 'Qwen3',
		image: 'qwen3:latest',
		context: 40000,
		parameters: '0.6B-235B',
		versions: [
			{parameters: '0.6b', size: 500, context: 40000, input: ['text']},
			{parameters: '1.7b', size: 1400, context: 40000, input: ['text']},
			{parameters: '4b', size: 2600, context: 40000, input: ['text']},
			{parameters: '8b', size: 5200, context: 40000, input: ['text'], isLatest: true},
			{parameters: '14b', size: 9300, context: 40000, input: ['text']},
			{parameters: '30b', size: 19000, context: 256000, input: ['text']},
			{parameters: '32b', size: 20000, context: 40000, input: ['text']},
			{parameters: '235b', size: 142000, context: 256000, input: ['text']}
		],
		icon: 'qwen.svg',
		size: 5.2,
		tags: ['chat', 'text', 'reasoning', 'tools', 'thinking', 'multilingual'],
		description: `Qwen3 is the latest generation of large language models in Qwen series, offering a comprehensive suite of dense and mixture-of-experts (MoE) models. It supports 100+ languages and excels in reasoning, coding, math, and agent capabilities.`,
		installed: false,
		popularity: 4600,
		fav: false,
		className: 'qwen'
	},
	{
		name: 'Llama3.2',
		image: 'llama3.2:latest',
		context: 32000,
		parameters: '3B',
		versions: [
			{parameters:'1b', size: 1300, context: 128000, input: ['text'], isLatest: true}, 
			{parameters:'3b', size: 2000, context: 128000, input: ['text']}
		],
		icon: 'llama.svg',
		size: 2.0,
		tags: ['chat', 'text', 'reasoning', 'tools'],
		description: `Meta's Llama 3.2 goes small with 1B and 3B models. The Llama 3.2 instruction-tuned text only models are optimized for multilingual dialogue use cases, including agentic retrieval and summarization tasks.`,
		installed: false,
		popularity: 28400,
		fav: true,
		className: 'llama'
	}
	// {
	// 	name: 'nomic-embed-text',
	// 	image: 'nomic-embed-text:latest',
	// 	context: 2000,
	// 	versions: [
	// 		{parameters: 'v1.5', size: 274, context: 2000, input: ['text'], isLatest: true}
	// 	],
	// 	icon: 'model.svg',
	// 	size: 0.274,
	// 	tags: ['embedding'],
	// 	description: `Nomic-embed-text is a text embedding model that can be used to generate embeddings for text data.`,
	// 	installed: false,
	// 	popularity: 34700,
	// 	fav: false,
	// 	className: 'nomic'
	// }
];

export const models = writable([]);
export const currentModel = writable({});
