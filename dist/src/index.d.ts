export type TransformationRule = {
    pattern: RegExp;
    matchGroup?: number;
};
type TreeNode = {
    type: string;
    oryginal?: string;
    values: (string | TreeNode)[];
};
export declare const transform: (input: string, rules: TransformationRule[]) => TreeNode;
export {};
