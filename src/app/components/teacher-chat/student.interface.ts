export interface StudentInterface {

  // Id of the student
  id: string;

  // Indicates whether the student is writing a message
  isTyping: boolean;

  // Name of the student
  name: string;

  // Input of the teacher in the input bar
  userInput: string;

  // Number of messages not seen yet by the teacher
  unseen: number;
};
