const apiKey = 'OpenAPI key';

// Call OpenAI API to translate natural language to SQL
async function callOpenAiApi(prompt) {
  // Set up API request headers
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`,
  };

  // Set up API request payload
  const payload = {
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: 'system',
        content: 'Translate the following natural language question to SQL:'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    max_tokens: 150,
    n: 1,
    stop: null,
    temperature: 0.8,
  };

  try {
    // Make API call
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(payload),
    });

    // Parse API response
    const data = await response.json();

    // Check if the response contains an error
    if (!response.ok) {
      console.error('Error response from OpenAI API:', response);
      console.error('Error details:', data);
      throw new Error('Error calling OpenAI API');
    }

    // Extract translated SQL text from API response
    const translatedSql = data.choices[0].message.content.trim();

    // Return translated SQL text
    return translatedSql;
  } catch (error) {
    console.error('Error calling OpenAI API:', error);
    throw error;
  }
}

// Function to highlight SQL syntax
function highlightSql(sql) {
  // Regex patterns for keywords, strings, and numbers
  const keywordPattern = /\b(SELECT|FROM|WHERE|AND|OR|JOIN|ON|IN|GROUP BY|ORDER BY|ASC|DESC|LIMIT|OFFSET|HAVING|AS|INNER|OUTER|LEFT|RIGHT|FULL|DISTINCT|UNION|ALL|ANY|LIKE|BETWEEN)\b/gi;
  const stringPattern = /('.*?'|".*?")/g;
  const numberPattern = /\b\d+\b/g;

  // Wrap matches with appropriate span elements
  sql = sql.replace(keywordPattern, '<span class="keyword">$&</span>');
  sql = sql.replace(stringPattern, '<span class="string">$&</span>');
  sql = sql.replace(numberPattern, '<span class="number">$&</span>');

  return sql;
}



// Add event listener for "Generate Query" button click
document.getElementById('generate-query').addEventListener('click', async () => {
  const schemaInput = document.getElementById('schema-input');
  const questionInput = document.getElementById('question-input');
  const sqlResult = document.getElementById('sql-result');

  const schema = schemaInput.value.trim();
  const question = questionInput.value.trim();

  // Check if the question input is empty
  if (!question) {
    alert('Please enter a question.');
    return;
  }

  // Generate prompt for OpenAI API
  const prompt = `Please translate to SQL language according to this table schema and question and add comments to each section:\nSchema: ${schema}\nquestion: ${question}`;

  try {
    // Call OpenAI API and display translated SQL in the sqlResult div
    const translatedSql = await callOpenAiApi(prompt);
    sqlResult.innerText = translatedSql;
  } catch (error) {
   
    console.error('Error response from OpenAI API:', error.response);
    console.error('Error details:', error.response.data);

    alert('An error occurred while translating your question to SQL.');
  }
});

