import React from "react";

interface CategoryProps {
    id: string;
    name: string;
}
const Categories = ({categories}: {categories: CategoryProps[]}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category) => {
        const categoryProblems = mockProblems.filter(
          (p) => p.category === category
        );
        const solvedInCategory = categoryProblems.filter((p) =>
          solvedProblemIds.includes(p.id)
        ).length;
        const progressPercentage =
          (solvedInCategory / categoryProblems.length) * 100;

        return (
          <div
            key={category}
            className="group bg-white rounded-2xl border border-slate-200/60 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Code2 className="h-6 w-6 text-white" />
                </div>
                <Badge
                  variant="outline"
                  className="border-slate-300 text-slate-600"
                >
                  {categoryProblems.length} problems
                </Badge>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                {category}
              </h3>

              <p className="text-sm text-slate-600 mb-4">
                {solvedInCategory}/{categoryProblems.length} solved
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Progress</span>
                  <span className="font-medium text-slate-900">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              <Button
                variant="outline"
                className="w-full border-slate-200 hover:bg-slate-50 rounded-xl group-hover:border-indigo-300 group-hover:text-indigo-600 bg-transparent"
                onClick={() => setCategoryFilter(category)}
              >
                View Problems
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Categories;
