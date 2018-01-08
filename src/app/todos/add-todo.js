
function AddTodo() {
  var self = this;
  var $row = $('<div class="row"/>');
  $('#todo_add').append($row);

  var $cell = $('<div class="col-lg-12"/>');
  var $form = $('<form action="javascript:void(0)" method="POST"/>');
  var $inputGroup = $('<div class="input-group"/>');
  var $addField = $('<input type="text" placeholder="Todo text..." class="form-control"/>');
  var $buttonGroup = $('<span class="input-group-btn"/>');
  var $addButton = $('<button type="submit" class="btn btn-primary"/>');
  $addButton.html('Add');

  $buttonGroup.append($addButton);
  $inputGroup.append($addField);
  $inputGroup.append($buttonGroup);
  $form.append($inputGroup);
  $cell.append($form);
  $row.append($cell);

  $form.submit(function(event) {
    event.preventDefault();
    self.add($form, $addField, $addButton);
  });

  events.subscribe('edit-todo-item', function(event) {
    var details = event.detail;

    if (!details.todo) { return }

    self.edit($form, $addField, $addButton, details);
  });
}

AddTodo.prototype.add = function($form, $addField, $addButton) {
  var todos = data.read('todos');
  if (!todos) {
    todos = [];
    data.create('todos', JSON.stringify([]));
  } else {
    todos = JSON.parse(todos);
  }

  var $typeField = $form.find('[name="type"]');
  var $indexField = $form.find('[name="index"]');
  if ($typeField.length && $typeField.val() === 'save' && $indexField.length) {
    todos[+$indexField.val()].text = $addField.val();
    $typeField.remove();
    $indexField.remove();
  } else {
    todos.push({
      text: $addField.val(),
      checked: false
    });
  }

  $addButton.html('Add');

  data.update('todos', JSON.stringify(todos));

  $form[0].reset();

  events.send('get-todos-list');
};

AddTodo.prototype.edit = function($form, $addField, $addButton, details) {
  var $typeField = $form.find('[name="type"]');
  if (!$typeField.length) {
    $typeField = $('<input type="hidden" name="type"/>');
    $form.append($typeField);
  }
  $typeField.val('save');

  var $indexField = $form.find('[name="index"]');
  if (!$indexField.length) {
    $indexField = $('<input type="hidden" name="index"/>');
    $form.append($indexField);
  }
  $indexField.val(details.index);

  $addButton.html('Save');
  $addField.val(details.todo.text);
};

var addTodo = new AddTodo();
