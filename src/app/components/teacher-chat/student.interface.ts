export interface StudentInterface {

  // Id of the student
  id: string;

  // Indicates whether the student is writing a message
  isTyping: boolean;

  // Name of the student
  name: string;

  // Indicates if the student is actually discussing with the agent
  discussWithAgent: boolean;

  // Input of the teacher in the input bar
  userInput: string;

  // Number of messages not seen yet by the teacher
  unseen: number;
};

/*  Initialize a student interface.

    PARAMS
      none

    RETURN
      (StudentInterface) object that follows StudentInterface template
*/
export function initStudentInterface(): StudentInterface {

  let student: StudentInterface = {
    id: '',
    isTyping: false,
    name: '',
    discussWithAgent: false,
    userInput: '',
    unseen: 0
  };

  return student;
}
