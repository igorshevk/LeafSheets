
export const convertVariablesToInputs = (variables) => {
    let result = [];
    let previousGroup = null;
    variables.filter(variable => variable.type === 'INPUT').forEach(variable => {
        if (variable.meta.group !== previousGroup) {
            previousGroup = variable.meta.group;
            let newGroup = {
                name: variable.meta.group,
                inputs: [{
                    find: variable.find,
                    type: variable.type,
                    match: variable.match,
                    replace: variable.replace,
                    name: variable.meta.name,
                    prompt: variable.meta.prompt,
                    required: variable.meta.required,
                    default: variable.meta.default
                }]
            };
            result.push(newGroup);
        } else {
            result[result.length - 1].inputs.push({
                find: variable.find,
                type: variable.type,
                match: variable.match,
                replace: variable.replace,
                name: variable.meta.name,
                prompt: variable.meta.prompt,
                required: variable.meta.required,
                default: variable.meta.default
            });
        }
    });
    return result;
}

export const extractNameValuePairsFromVariabels = (variables) => {
    let result = [];
    variables.filter(variable => variable.type === 'INPUT').forEach(variable => {
        result.push({
            [variable.find]: variable.replace
        })
    })
    return result;
}