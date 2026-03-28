// Log Workout Modal - Form to log completed workout
import React, { useState } from 'react';
import { useSessions } from '../hooks/useSessions';
import './LogWorkoutModal.css';

function LogWorkoutModal({ userId, workout, date, onClose, onSaved }) {
  const { addSession } = useSessions(userId);
  const [exercises, setExercises] = useState(
    (workout?.exercises || []).map(ex => ({
      ...ex,
      completedSets: [{ reps: 0, weight: 0, notes: '' }],
    }))
  );
  const [duration, setDuration] = useState(45);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddSet = (exerciseIndex) => {
    const updated = [...exercises];
    updated[exerciseIndex].completedSets.push({ reps: 0, weight: 0, notes: '' });
    setExercises(updated);
  };

  const handleSetChange = (exerciseIndex, setIndex, field, value) => {
    const updated = [...exercises];
    updated[exerciseIndex].completedSets[setIndex][field] = value;
    setExercises(updated);
  };

  const handleRemoveSet = (exerciseIndex, setIndex) => {
    const updated = [...exercises];
    updated[exerciseIndex].completedSets.splice(setIndex, 1);
    setExercises(updated);
  };

  const handleSaveWorkout = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate at least one set has been logged
      const hasData = exercises.some(ex =>
        ex.completedSets.some(set => set.reps > 0 || set.weight > 0)
      );

      if (!hasData) {
        setError('Please log at least one exercise');
        return;
      }

      const sessionData = {
        date: date || new Date().toISOString().split('T')[0],
        workoutType: workout?.type || 'custom',
        duration,
        exercises,
        notes,
        completed: true,
      };

      const saved = await addSession(sessionData);
      if (onSaved) onSaved(saved);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save workout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content log-workout-modal">
        <div className="modal-header">
          <h2>Log Workout</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSaveWorkout}>
          <div className="form-section">
            <label>
              Duration (minutes)
              <input
                type="number"
                value={duration}
                onChange={e => setDuration(parseInt(e.target.value) || 0)}
                min="1"
                max="180"
              />
            </label>
          </div>

          <div className="form-section">
            <h3>Exercises</h3>
            {exercises.length === 0 ? (
              <p className="no-exercises">No exercises in this workout</p>
            ) : (
              exercises.map((exercise, exIndex) => (
                <div key={exIndex} className="exercise-card">
                  <h4>{exercise.exerciseName}</h4>

                  <div className="sets-container">
                    {exercise.completedSets.map((set, setIndex) => (
                      <div key={setIndex} className="set-row">
                        <div className="set-number">Set {setIndex + 1}</div>
                        <input
                          type="number"
                          placeholder="Reps"
                          value={set.reps}
                          onChange={e =>
                            handleSetChange(exIndex, setIndex, 'reps', parseInt(e.target.value) || 0)
                          }
                          min="0"
                        />
                        <input
                          type="number"
                          placeholder="Weight (lbs)"
                          value={set.weight}
                          onChange={e =>
                            handleSetChange(exIndex, setIndex, 'weight', parseInt(e.target.value) || 0)
                          }
                          min="0"
                        />
                        <input
                          type="text"
                          placeholder="Notes"
                          value={set.notes}
                          onChange={e =>
                            handleSetChange(exIndex, setIndex, 'notes', e.target.value)
                          }
                        />
                        {exercise.completedSets.length > 1 && (
                          <button
                            type="button"
                            className="btn-remove-set"
                            onClick={() => handleRemoveSet(exIndex, setIndex)}
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="btn-add-set"
                    onClick={() => handleAddSet(exIndex)}
                  >
                    + Add Set
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="form-section">
            <label>
              Session Notes
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="How did you feel? Any observations?"
                rows="3"
              />
            </label>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Workout'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LogWorkoutModal;
