const MODELS = [
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
  {
    name: "Mistral 7B",
    params: 7_000_000_000,
    layers: 32,
    hidden: 4096
  },
  {
    name: "Llama 3 8B",
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
  {
    name: "Llama 3.1 8B",
    params: 8_000_000_000,
    layers: 32,
    hidden: 4096
  },
  {
    name: "Qwen 2.5 14B",
    params: 14_000_000_000,
    layers: 48,
    hidden: 5120
  },
  {
    name: "Mixtral 8x7B",
    params: 47_000_000_000,
    layers: 32,
    hidden: 4096
  },
  {
    name: "Llama 3.1 70B",
    params: 70_000_000_000,
    layers: 80,
    hidden: 8192
  },
  {
    name: "Llama 3.1 405B",
    params: 405_000_000_000,
    layers: 126,
    hidden: 16384
  }
];

const QUANT_TABLE = {
  "4bit": { label: "4-bit (Efficient)", bytesPerParam: 0.6 },
  "8bit": { label: "8-bit (Balanced)", bytesPerParam: 1.05 },
  "fp16": { label: "FP16 (High Quality)", bytesPerParam: 2.0 }
};