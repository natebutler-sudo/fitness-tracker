// Exercise Library Component
import React, { useMemo } from 'react';
import { exercises } from '../data/exercises';
import './ExerciseLibrary.css';

function ExerciseLibrary() {
  // Group exercises by category from local data
  const groupedByCategory = useMemo(() => ({
    upper: exercises.filter(e => e.category === 'upper'),
    lower: exercises.filter(e => e.category === 'lower'),
    cardio: exercises.filter(e => e.category === 'cardio'),
    core: exercises.filter(e => e.category === 'core'),
  }), []);


  const categories = [
    { key: 'upper', label: 'Upper Body', icon: '💪' },
    { key: 'lower', label: 'Lower Body', icon: '🦵' },
    { key: 'cardio', label: 'Cardio', icon: '🏃' },
    { key: 'core', label: 'Core', icon: '🫀' },
  ];

  return (
    <div className="exercise-library">
      <h2>Exercise Library</h2>
      <p className="total-exercises">Total exercises: {exercises.length}</p>

      {categories.map(category => (
        <div key={category.key} className="exercise-category">
          <h3>
            {category.icon} {category.label}
          </h3>
          <div className="exercises-grid">
            {groupedByCategory[category.key].map(exercise => (
              <div key={exercise.id} className="exercise-card">
                <h4>{exercise.name}</h4>
                <p className="description">{exercise.description}</p>

                {exercise.muscleGroups && (
                  <div className="muscle-groups">
                    <strong>Targets:</strong>
                    <div className="tags">
                      {exercise.muscleGroups.map(muscle => (
                        <span key={muscle} className="tag">
                          {muscle}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {exercise.equipment && exercise.equipment.length > 0 && (
                  <div className="equipment">
                    <strong>Equipment:</strong>
                    <div className="tags">
                      {exercise.equipment.map(eq => (
                        <span key={eq} className="tag equipment-tag">
                          {eq}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {exercise.variations && exercise.variations.length > 0 && (
                  <div className="variations">
                    <strong>Variations:</strong>
                    <p>{exercise.variations.join(', ')}</p>
                  </div>
                )}

                {exercise.trainerExample && (
                  <div className="trainer-example">
                    <strong>From trainer (date: {exercise.trainerExample.date}):</strong>
                    <p>
                      {exercise.trainerExample.reps.length} sets ×{' '}
                      {exercise.trainerExample.reps[0]} reps
                      {exercise.trainerExample.weight[0] > 0 &&
                        ` @ ${exercise.trainerExample.weight} lbs`}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ExerciseLibrary;
