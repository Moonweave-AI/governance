# AI, Agent & Data

Terms related to artificial intelligence, language models, autonomous agents, and data management within the Kaguya Project.

---

## Agent

An AI system that can perceive its environment, make decisions, and take actions to achieve goals. In the Kaguya Project, agents have tool-calling capabilities, long-term memory, personality consistency, and operate under explicit permission boundaries.

## LLM (Large Language Model)

A neural network trained on massive text corpora that can generate, understand, and reason about natural language. The computational foundation for conversational agents, code generation, and text analysis.

## RAG (Retrieval-Augmented Generation)

A technique combining information retrieval (searching a knowledge base) with generation (producing a response). Reduces hallucination by grounding outputs in retrieved evidence.

## Prompt

The input text provided to a language model that guides its response. Includes system prompts (behavioral instructions), user prompts (queries), and few-shot examples.

## System Prompt

A special prompt defining an agent's behavior, capabilities, constraints, and persona. Controls how the agent responds across all interactions. Version-controlled as a critical behavioral artifact.

## Policy

A set of rules governing agent behavior: what actions are allowed, what topics to refuse, how to handle uncertainty, when to escalate to humans. Distinct from the system prompt—policies define boundaries, prompts define behavior.

## Tool Calling

An agent's ability to invoke external functions (APIs, databases, file systems, calculators, web searches) as part of its reasoning process. Each tool requires explicit permission grants.

## Prompt Injection

An attack where malicious input causes an AI system to ignore its instructions and execute unintended actions. A critical security concern for agents with tool access or memory write capabilities.

## Hallucination

When an AI model generates plausible-sounding but factually incorrect information. A quality and safety concern requiring detection mechanisms, uncertainty signaling, and output validation.

## Long-term Memory

Persistent state that an agent retains across sessions—conversation history, user preferences, learned facts, and behavioral adaptations. Requires integrity protection against poisoning and drift.

## Memory Poisoning

An attack where an adversary causes an agent to store false or malicious information in its long-term memory, affecting future behavior. Mitigated by memory write policies and integrity checks.

## Embedding

A dense vector representation of text, images, or other data in a continuous space where semantic similarity corresponds to geometric proximity. Used for retrieval, clustering, and similarity search.

## Vector Store

A database optimized for storing and querying high-dimensional embeddings using approximate nearest neighbor search. Core infrastructure for RAG systems.

## Drift

Gradual degradation of model performance over time as the distribution of real-world data diverges from training data. Requires monitoring and periodic retraining or evaluation.

## Eval / Evaluation

Systematic measurement of AI system performance against defined metrics, datasets, and behavioral expectations. Includes accuracy, safety, robustness, fairness, cost, and latency dimensions.

## Red Team

Adversarial testing where evaluators deliberately attempt to make an AI system produce harmful, incorrect, or policy-violating outputs. Used to discover failure modes before deployment.

## Model Card

A documentation artifact accompanying a published model, describing its intended use, training data, evaluation results, limitations, biases, and ethical considerations.

## Dataset Card

A documentation artifact describing a dataset's composition, collection process, intended use, limitations, licensing, privacy considerations, and quality checks.

## Fine-tuning

Adapting a pre-trained model to a specific task or domain by further training on specialized data. Changes model behavior more deeply than prompting alone.

## RLHF (Reinforcement Learning from Human Feedback)

A training technique that aligns model behavior with human preferences by using human judgments as reward signals. Shapes helpfulness, harmlessness, and honesty.

## Token

The basic unit of text processing for language models. A token can be a word, subword, or character depending on the tokenizer. Context windows and costs are measured in tokens.

## Context Window

The maximum number of tokens a model can process in a single forward pass. Determines how much history, retrieved context, and instructions an agent can consider simultaneously.

## Inference

Running a trained model to produce outputs from inputs. Distinguished from training by being forward-pass only and typically latency/cost-sensitive.

## Datasheets for Datasets

A documentation framework proposing that every dataset be accompanied by a datasheet describing its motivation, composition, collection process, recommended uses, and distribution details.

## FAIR Principles

Guidelines stating that digital research assets should be Findable, Accessible, Interoperable, and Reusable. Applied to datasets, models, and research artifacts.
