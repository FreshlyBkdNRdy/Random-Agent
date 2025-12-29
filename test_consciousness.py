"""
Tests for consciousness loop system
"""

import asyncio
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent / 'src'))

from consciousness_loop import ConsciousnessLoop, NodeType  # type: ignore
from ai_brain import AIBrain  # type: ignore
from integrated_system import IntegratedConsciousnessSystem  # type: ignore


async def test_consciousness_loop_initialization():
    """Test consciousness loop initializes correctly"""
    consciousness = ConsciousnessLoop()
    
    assert len(consciousness.nodes) > 0, "Nodes should be initialized"
    assert NodeType.MEMORY in consciousness.nodes, "Memory node required"
    assert NodeType.DECISION_MAKER in consciousness.nodes, "Decision maker required"
    print("✓ Consciousness loop initialization test passed")


async def test_consciousness_cycle():
    """Test a complete consciousness cycle"""
    consciousness = ConsciousnessLoop()
    
    test_input = {
        'store': True,
        'content': 'Test experience',
        'emotion': 'curiosity'
    }
    
    frame = await consciousness.process_consciousness_cycle(test_input)
    
    assert frame.cycle_id == 1, "Cycle ID should be 1"
    assert len(frame.node_states) > 0, "Node states should be populated"
    assert frame.decision_output is not None, "Decision should be generated"
    assert 0 <= frame.confidence <= 1, "Confidence should be between 0 and 1"
    print("✓ Consciousness cycle test passed")


async def test_parallel_processing():
    """Test that nodes process in parallel"""
    consciousness = ConsciousnessLoop()
    
    test_input = {'store': True, 'content': 'Parallel test'}
    frame = await consciousness.process_consciousness_cycle(test_input)
    
    # All nodes should be processed
    processed_nodes = [s for s in frame.node_states.values() if s.processed]
    assert len(processed_nodes) > 0, "Nodes should be processed"
    print("✓ Parallel processing test passed")


async def test_ai_brain_initialization():
    """Test AI brain initializes correctly"""
    brain = AIBrain(name="TestBrain")
    
    assert brain.name == "TestBrain", "Name should be set"
    assert brain.processing_cycle == 0, "Processing cycle should start at 0"
    assert len(brain.memory.short_term) == 0, "Memory should be empty"
    print("✓ AI brain initialization test passed")


async def test_ai_consciousness_cycle():
    """Test AI brain consciousness cycle"""
    brain = AIBrain(name="TestBrain")
    
    sensory_input = {
        'visual': 'test input',
        'semantic_context': 'testing'
    }
    
    result = await brain.consciousness_cycle(sensory_input)
    
    assert result['cycle'] == 1, "First cycle should be 1"
    assert 'decision' in result, "Decision should be generated"
    assert 'self_model' in result, "Self model should be generated"
    assert len(brain.memory.short_term) == 1, "Memory should store experience"
    print("✓ AI consciousness cycle test passed")


async def test_integrated_system():
    """Test integrated consciousness system"""
    system = IntegratedConsciousnessSystem()
    
    stimulus = {
        'store': True,
        'content': 'Integration test',
        'emotion': 'interest'
    }
    
    bio_report, ai_result, comparison = await system.run_parallel_consciousness(stimulus)
    
    assert bio_report is not None, "Biological report should be generated"
    assert ai_result is not None, "AI result should be generated"
    assert 0 <= comparison.convergence_score <= 1, "Convergence should be valid"
    assert system.cycle_count == 1, "System should track cycles"
    print("✓ Integrated system test passed")


async def test_memory_consolidation():
    """Test memory consolidation"""
    brain = AIBrain()
    
    # Add multiple memories
    for i in range(5):
        brain.memory.store_short_term({'index': i, 'content': f'Memory {i}'})
    
    assert len(brain.memory.short_term) == 5, "Should store in short-term"
    
    # Retrieve
    retrieved = brain.memory.retrieve_relevant('Memory 2')
    assert len(retrieved) > 0, "Should retrieve relevant memories"
    print("✓ Memory consolidation test passed")


async def test_multiple_cycles():
    """Test multiple consciousness cycles"""
    consciousness = ConsciousnessLoop()
    
    for i in range(3):
        test_input = {'store': True, 'content': f'Cycle {i}'}
        frame = await consciousness.process_consciousness_cycle(test_input)
        assert frame.cycle_id == i + 1, f"Cycle ID should be {i + 1}"
    
    assert consciousness.cycle_count == 3, "Should track all cycles"
    print("✓ Multiple cycles test passed")


async def run_all_tests():
    """Run all tests"""
    print("\n" + "="*50)
    print("RUNNING CONSCIOUSNESS TESTS")
    print("="*50 + "\n")
    
    tests = [
        test_consciousness_loop_initialization,
        test_consciousness_cycle,
        test_parallel_processing,
        test_ai_brain_initialization,
        test_ai_consciousness_cycle,
        test_memory_consolidation,
        test_multiple_cycles,
        test_integrated_system,
    ]
    
    passed = 0
    failed = 0
    
    for test in tests:
        try:
            await test()
            passed += 1
        except Exception as e:
            print(f"✗ {test.__name__} failed: {e}")
            failed += 1
    
    print("\n" + "="*50)
    print(f"RESULTS: {passed} passed, {failed} failed")
    print("="*50 + "\n")
    
    return failed == 0


if __name__ == "__main__":
    success = asyncio.run(run_all_tests())
    sys.exit(0 if success else 1)
