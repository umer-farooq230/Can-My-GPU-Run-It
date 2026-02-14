const MODELS = [
  // Small Models
  {
    name: "TinyLlama 1.1B",
    params: 1_100_000_000,
    layers: 22,
    hidden: 2048
  },
  {
    name: "Llama 3.2 1B",
    params: 1_000_000_000,
    layers: 16,
    hidden: 2048
  },
  {
    name: "Llama 3.2 3B",
    params: 3_000_000_000,
    layers: 28,
    hidden: 3072
  },
  // 7B Tier
  {
    name: "Mistral 7B",
    params: 7_000_000_000,
    layers: 32,
    hidden: 4096
  },
  {
    name: "Llama 2 7B",
    params: 7_000_000_000,
    layers: 32,
    hidden: 4096
  },
  {
    name: "Gemma 7B",
    params: 7_000_000_000,
    layers: 28,
    hidden: 3072
  },
  // 8–9B Tier
  {
    name: "Llama 3 8B",
    params: 8_000_000_000,
    layers: 32,
    hidden: 4096
  },
  {
    name: "Llama 3.1 8B",
    params: 8_000_000_000,
    layers: 32,
    hidden: 4096
  },
  {
    name: "Gemma 2 9B",
    params: 9_000_000_000,
    layers: 42,
    hidden: 3584
  },
  // 13–14B Tier
  {
    name: "Llama 2 13B",
    params: 13_000_000_000,
    layers: 40,
    hidden: 5120
  },
  {
    name: "Qwen 2.5 14B",
    params: 14_000_000_000,
    layers: 48,
    hidden: 5120
  },
  // MoE
  {
    name: "Mixtral 8x7B",
    params: 47_000_000_000, // total parameters
    layers: 32,
    hidden: 4096
  },
  // 30B Tier
  {
    name: "Llama 2 34B",
    params: 34_000_000_000,
    layers: 48,
    hidden: 8192
  },
  // 70B Tier
  {
    name: "Llama 3.1 70B",
    params: 70_000_000_000,
    layers: 80,
    hidden: 8192
  },
  {
    name: "Qwen 72B",
    params: 72_000_000_000,
    layers: 80,
    hidden: 8192
  },
  // Extreme Tier
  {
    name: "Llama 3.1 405B",
    params: 405_000_000_000,
    layers: 126,
    hidden: 16384
  }
];
