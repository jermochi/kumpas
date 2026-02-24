import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import fs from 'fs';
import path from 'path';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to read prompt files safely
export function getSystemInstructions(filename: string) {
  const filePath = path.join(process.cwd(), 'src/prompts', filename);
  return fs.readFileSync(filePath, 'utf8');
}

// Helper function to read JSON context files in directory
export function getJsonContexts(directoryName: string) {
  const dirPath = path.join(process.cwd(), 'public/data/', directoryName);
  
  if (!fs.existsSync(dirPath)) {
    return '';
  }

  const files = fs.readdirSync(dirPath);
  
  const xmlContexts = files
    .filter(file => file.endsWith('.json')) // Making sure only JSON files are read
    .map(file => {
      const filePath = path.join(dirPath, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Extract filename for the XML tag
      const tagName = path.parse(file).name;
      
      return `<${tagName}>\n${content}\n</${tagName}>`;
    });

  // Join all XML-wrapped contexts
  return xmlContexts.join('\n\n');
}