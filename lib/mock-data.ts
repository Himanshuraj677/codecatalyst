export interface User {
  id: string
  name: string
  email: string
  role: "student" | "teacher"
  avatar?: string
  bio?: string
}

export interface Course {
  id: string
  name: string
  description: string
  instructor: string
  instructorId: string
  studentCount: number
  joinCode: string
  createdAt: string
}

export interface Problem {
  id: string
  title: string
  description: string
  difficulty: "Easy" | "Medium" | "Hard"
  tags: string[]
  timeLimit: number // in seconds
  memoryLimit: number // in MB
  sampleInput: string
  sampleOutput: string
  explanation?: string
  constraints: string[]
  testCases: TestCase[]
  createdAt: string
  createdBy: string
  category: string
}

export interface TestCase {
  id: string
  input: string
  expectedOutput: string
  isHidden: boolean
}

export interface Assignment {
  id: string
  title: string
  description: string
  courseId: string
  courseName: string
  problems: string[] // Array of problem IDs
  dueDate: string
  maxAttempts?: number
  createdAt: string
}

export interface Submission {
  id: string
  problemId: string
  problemTitle: string
  assignmentId?: string
  assignmentTitle?: string
  studentId: string
  studentName: string
  code: string
  language: string
  status: "Accepted" | "Wrong Answer" | "Time Limit Exceeded" | "Runtime Error" | "Pending" | "Compilation Error"
  submittedAt: string
  score?: number
  feedback?: string
  testCasesPassed?: number
  totalTestCases?: number
  executionTime?: number
  memoryUsed?: number
}

// Mock current user - change role to test different views
export const currentUser: User = {
  id: "u123",
  name: "Himanshu Raj",
  email: "himanshu@example.com",
  role: "student", // Change to "teacher" to test teacher view
  avatar: "/placeholder.svg?height=40&width=40",
  bio: "Computer Science student passionate about algorithms and web development.",
}

export const mockUsers: User[] = [
  currentUser,
  {
    id: "t1",
    name: "Prof. Sharma",
    email: "sharma@college.edu",
    role: "teacher",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "Professor of Data Structures and Algorithms with 10+ years of experience.",
  },
  {
    id: "t2",
    name: "Prof. Mehta",
    email: "mehta@college.edu",
    role: "teacher",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "Web Development and Software Engineering instructor.",
  },
]

export const mockCourses: Course[] = [
  {
    id: "c1",
    name: "Data Structures & Algorithms",
    description: "Comprehensive course covering fundamental data structures and algorithmic problem solving.",
    instructor: "Prof. Sharma",
    instructorId: "t1",
    studentCount: 45,
    joinCode: "DSA2024",
    createdAt: "2024-01-15",
  },
  {
    id: "c2",
    name: "Web Development",
    description: "Full-stack web development using modern frameworks and technologies.",
    instructor: "Prof. Mehta",
    instructorId: "t2",
    studentCount: 38,
    joinCode: "WEB2024",
    createdAt: "2024-01-20",
  },
  {
    id: "c3",
    name: "Database Systems",
    description: "Database design, SQL, and database management systems.",
    instructor: "Prof. Sharma",
    instructorId: "t1",
    studentCount: 32,
    joinCode: "DB2024",
    createdAt: "2024-02-01",
  },
]

export const mockProblems: Problem[] = [
  {
    id: "p1",
    title: "Two Sum",
    description:
      "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    difficulty: "Easy",
    tags: ["Array", "Hash Table"],
    timeLimit: 1,
    memoryLimit: 256,
    sampleInput: "nums = [2,7,11,15], target = 9",
    sampleOutput: "[0,1]",
    explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists.",
    ],
    testCases: [
      { id: "tc1", input: "[2,7,11,15]\n9", expectedOutput: "[0,1]", isHidden: false },
      { id: "tc2", input: "[3,2,4]\n6", expectedOutput: "[1,2]", isHidden: true },
    ],
    createdAt: "2024-01-10",
    createdBy: "t1",
    category: "Arrays",
  },
  {
    id: "p2",
    title: "Valid Parentheses",
    description:
      "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    difficulty: "Easy",
    tags: ["String", "Stack"],
    timeLimit: 1,
    memoryLimit: 256,
    sampleInput: 's = "()"',
    sampleOutput: "true",
    explanation: "The string contains valid parentheses.",
    constraints: ["1 <= s.length <= 10^4", "s consists of parentheses only '()[]{}'."],
    testCases: [
      { id: "tc1", input: "()", expectedOutput: "true", isHidden: false },
      { id: "tc2", input: "()[]{}", expectedOutput: "true", isHidden: true },
    ],
    createdAt: "2024-01-12",
    createdBy: "t1",
    category: "Stack",
  },
  {
    id: "p3",
    title: "Binary Tree Inorder Traversal",
    description:
      "Given the root of a binary tree, return the inorder traversal of its nodes' values.\n\nInorder traversal visits nodes in the order: left subtree, root, right subtree.",
    difficulty: "Medium",
    tags: ["Tree", "Binary Tree", "Recursion"],
    timeLimit: 2,
    memoryLimit: 256,
    sampleInput: "root = [1,null,2,3]",
    sampleOutput: "[1,3,2]",
    explanation: "Inorder traversal: left -> root -> right",
    constraints: ["The number of nodes in the tree is in the range [0, 100].", "-100 <= Node.val <= 100"],
    testCases: [
      { id: "tc1", input: "[1,null,2,3]", expectedOutput: "[1,3,2]", isHidden: false },
      { id: "tc2", input: "[]", expectedOutput: "[]", isHidden: true },
    ],
    createdAt: "2024-01-15",
    createdBy: "t1",
    category: "Trees",
  },
  {
    id: "p4",
    title: "Longest Palindromic Substring",
    description:
      "Given a string s, return the longest palindromic substring in s.\n\nA palindrome is a string that reads the same forward and backward.",
    difficulty: "Medium",
    tags: ["String", "Dynamic Programming"],
    timeLimit: 3,
    memoryLimit: 256,
    sampleInput: 's = "babad"',
    sampleOutput: '"bab"',
    explanation: '"aba" is also a valid answer.',
    constraints: ["1 <= s.length <= 1000", "s consist of only digits and English letters."],
    testCases: [
      { id: "tc1", input: "babad", expectedOutput: "bab", isHidden: false },
      { id: "tc2", input: "cbbd", expectedOutput: "bb", isHidden: true },
    ],
    createdAt: "2024-01-18",
    createdBy: "t2",
    category: "Strings",
  },
  {
    id: "p5",
    title: "Merge k Sorted Lists",
    description:
      "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.\n\nMerge all the linked-lists into one sorted linked-list and return it.",
    difficulty: "Hard",
    tags: ["Linked List", "Divide and Conquer", "Heap"],
    timeLimit: 5,
    memoryLimit: 512,
    sampleInput: "lists = [[1,4,5],[1,3,4],[2,6]]",
    sampleOutput: "[1,1,2,3,4,4,5,6]",
    explanation: "The linked-lists are merged into one sorted list.",
    constraints: ["k == lists.length", "0 <= k <= 10^4", "0 <= lists[i].length <= 500", "-10^4 <= lists[i][j] <= 10^4"],
    testCases: [
      { id: "tc1", input: "[[1,4,5],[1,3,4],[2,6]]", expectedOutput: "[1,1,2,3,4,4,5,6]", isHidden: false },
      { id: "tc2", input: "[]", expectedOutput: "[]", isHidden: true },
    ],
    createdAt: "2024-01-20",
    createdBy: "t1",
    category: "Linked Lists",
  },
]

export const mockAssignments: Assignment[] = [
  {
    id: "a1",
    title: "Basic Data Structures",
    description: "Practice fundamental data structure problems including arrays, stacks, and basic algorithms.",
    courseId: "c1",
    courseName: "Data Structures & Algorithms",
    problems: ["p1", "p2"], // Multiple problems
    dueDate: "2025-07-29",
    maxAttempts: 3,
    createdAt: "2025-07-20",
  },
  {
    id: "a2",
    title: "Advanced Algorithms",
    description: "Solve complex algorithmic problems involving trees and dynamic programming.",
    courseId: "c1",
    courseName: "Data Structures & Algorithms",
    problems: ["p3", "p4", "p5"], // Multiple problems
    dueDate: "2025-08-05",
    maxAttempts: 5,
    createdAt: "2025-07-22",
  },
  {
    id: "a3",
    title: "String Processing",
    description: "Work with string manipulation and pattern matching algorithms.",
    courseId: "c2",
    courseName: "Web Development",
    problems: ["p2", "p4"], // Multiple problems
    dueDate: "2025-08-01",
    maxAttempts: 3,
    createdAt: "2025-07-25",
  },
]

export const mockSubmissions: Submission[] = [
  {
    id: "s1",
    problemId: "p1",
    problemTitle: "Two Sum",
    assignmentId: "a1",
    assignmentTitle: "Basic Data Structures",
    studentId: "u123",
    studentName: "Himanshu Raj",
    code: `def twoSum(nums, target):
    hash_map = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in hash_map:
            return [hash_map[complement], i]
        hash_map[num] = i
    return []`,
    language: "python",
    status: "Accepted",
    submittedAt: "2025-07-26T10:30:00Z",
    score: 100,
    feedback: "Excellent implementation! Optimal time complexity.",
    testCasesPassed: 2,
    totalTestCases: 2,
    executionTime: 45,
    memoryUsed: 14.2,
  },
  {
    id: "s2",
    problemId: "p2",
    problemTitle: "Valid Parentheses",
    assignmentId: "a1",
    assignmentTitle: "Basic Data Structures",
    studentId: "u123",
    studentName: "Himanshu Raj",
    code: `def isValid(s):
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    
    for char in s:
        if char in mapping:
            if not stack or stack.pop() != mapping[char]:
                return False
        else:
            stack.append(char)
    
    return not stack`,
    language: "python",
    status: "Accepted",
    submittedAt: "2025-07-25T14:20:00Z",
    score: 100,
    feedback: "Perfect solution using stack data structure.",
    testCasesPassed: 2,
    totalTestCases: 2,
    executionTime: 32,
    memoryUsed: 13.8,
  },
]

// Helper functions
export const getUserCourses = (userId: string, role: "student" | "teacher"): Course[] => {
  if (role === "teacher") {
    return mockCourses.filter((course) => course.instructorId === userId)
  }
  // For students, return all courses (in real app, this would be filtered by enrollment)
  return mockCourses
}

export const getCourseAssignments = (courseId: string): Assignment[] => {
  return mockAssignments.filter((assignment) => assignment.courseId === courseId)
}

export const getUserSubmissions = (userId: string): Submission[] => {
  return mockSubmissions.filter((submission) => submission.studentId === userId)
}

export const getAssignmentSubmissions = (assignmentId: string): Submission[] => {
  return mockSubmissions.filter((submission) => submission.assignmentId === assignmentId)
}

export const getProblemSubmissions = (problemId: string): Submission[] => {
  return mockSubmissions.filter((submission) => submission.problemId === problemId)
}

export const getDueAssignments = (userId: string): Assignment[] => {
  const userSubmissions = getUserSubmissions(userId)
  const submittedAssignmentIds = [...new Set(userSubmissions.map((sub) => sub.assignmentId))]

  return mockAssignments.filter((assignment) => {
    const dueDate = new Date(assignment.dueDate)
    const today = new Date()
    return dueDate > today && !submittedAssignmentIds.includes(assignment.id)
  })
}

export const getProblemById = (problemId: string): Problem | undefined => {
  return mockProblems.find((problem) => problem.id === problemId)
}

export const getAssignmentProblems = (assignmentId: string): Problem[] => {
  const assignment = mockAssignments.find((a) => a.id === assignmentId)
  if (!assignment) return []

  return assignment.problems.map((problemId) => getProblemById(problemId)).filter(Boolean) as Problem[]
}
