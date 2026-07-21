# Embodiment & Robotics

Terms related to physical systems, robotic control, simulation, safety mechanisms, and hardware-software interaction.

---

## Embodied Intelligence

AI systems that interact with the physical world through sensors and actuators. In the Kaguya Project, this represents the transition from digital interaction to physical presence—requiring safety guarantees absent from pure software.

## HITL (Human-in-the-Loop)

An operational mode where a human supervises and can intervene in an automated system's decisions or actions. Required for embodied systems before they achieve sufficient autonomous safety validation.

## E-Stop (Emergency Stop)

A hardware or software mechanism that immediately halts all physical actuator movement and transitions the system to a known safe state. Must be always accessible, tested regularly, and independent of the main control software.

## SIL (Software-in-the-Loop)

A simulation technique where the actual control software runs against a simulated plant/environment model. Validates software logic without requiring physical hardware.

## HIL (Hardware-in-the-Loop)

A testing method where real hardware components (controllers, sensors, actuators) interact with simulated environments. Bridges the gap between pure simulation and physical deployment.

## Sim-to-Real

The process of transferring behaviors learned or validated in simulation to real physical systems. A critical challenge because simulation never perfectly represents physical reality.

## Hazard Analysis

A systematic process for identifying potential hazards (situations that could lead to harm), their causes, likelihood, severity, and required mitigations. Must be completed before any physical testing.

## Safe State

A predefined system configuration that the system enters when faults are detected or E-Stop is triggered. In a safe state, no actuator can cause unintended motion or harm.

## Actuator

A physical component that converts control signals into mechanical motion: motors, servos, pneumatic cylinders, hydraulic systems. Actuators are where software decisions become physical consequences.

## Sensor

A device that measures physical quantities (position, force, temperature, distance, orientation) and provides data to the control system. Sensor failures must be detected and handled gracefully.

## Workspace Boundary

The defined physical volume within which a robot or actuator is permitted to operate. Movements approaching or exceeding boundaries must be prevented by hardware or software limits.

## Control Loop

The continuous cycle of sensing the environment, computing a control action, and executing that action through actuators. Timing guarantees (latency, jitter) are critical for safe physical operation.

## Degrees of Freedom (DoF)

The number of independent parameters defining a system's configuration. More DoF means more capability but also more complex safety validation and larger hazard space.

## ROS / ROS 2 (Robot Operating System)

A middleware framework for robot software development providing communication infrastructure (topics, services, actions), tooling, and a package ecosystem. ROS 2 adds real-time support and improved security.

## QoS (Quality of Service) in ROS 2

Communication policies controlling reliability, durability, history depth, and deadline guarantees for ROS 2 message passing between nodes. Critical for safety-relevant communication.

## REP-2004

A ROS Enhancement Proposal defining quality levels for ROS 2 packages. Packages declare their quality level and must provide evidence (tests, documentation, version policy) matching that declaration.

## ISO/TS 15066

An international standard specifying safety requirements for collaborative industrial robot systems, including force/pressure limits for human-robot contact scenarios.

## Lifecycle (ROS 2 Managed Nodes)

A state machine for ROS 2 nodes with defined states (unconfigured, inactive, active, finalized) and transitions. Enables orderly startup, shutdown, and error recovery of robot subsystems.

## Fault Injection

Deliberately introducing failures (sensor noise, communication drops, actuator saturation) into a system to verify it handles faults correctly and maintains safety invariants.

## Physical Test Record

A formal log documenting the conditions, procedures, observations, and results of any test involving real hardware. Required for audit, reproducibility, and safety compliance.
