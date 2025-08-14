exports.validateSupplier=(name, email, phone, companyname, address, gstnumber)=> 
{
  let errors = [];

  if(!name || typeof name !== 'string' || name.trim() === '' || !isNaN(name)) 
  {
    errors.push("Supplier name is required.");
  }
  
  if(!email || typeof email !== 'string' || email.trim() === '')
  {
    errors.push("Email is required.");
  } 
  else 
  {
        let atIndex = email.indexOf('@');
        if(atIndex <= 0 || email.indexOf('@', atIndex + 1) !== -1 || 
        email.indexOf('.', email.indexOf('.') + 1) !== -1 ||   
        email.indexOf('.') === -1 || email.endsWith('.') || atIndex === email.length - 1 || 
        email !== email.toLowerCase()) 
        {
            errors.push("Email format is invalid.");
        }
  }

  if(typeof phone !== 'string' && typeof phone !== 'number') 
  {
     errors.push("Phone number must be a string or number.");
  } 
  else 
  {
    phone = phone.toString(); 

    if (phone.length !== 10) 
    {
        errors.push("Phone number must be exactly 10 digits.");
    } 
    else 
    {
        let isValid = true;
        for (let i = 0; i < phone.length; i++) 
        {
            if (phone[i] < '0' || phone[i] > '9') 
            {
                isValid = false;
                break;
            }
        }
        if (!isValid) 
        {
            errors.push("Phone number must contain only digits.");
        }
    }
  }

  if(companyname !== undefined && companyname !== null && typeof companyname !== 'string') 
  {
    errors.push("Company name must be a string.");
  }

  if(address !== undefined && address !== null && typeof address !== 'string') 
  {
    errors.push("Address must be a string.");
  }

  if(gstnumber !== undefined && gstnumber !== null && (typeof gstnumber !== 'string' || gstnumber.length !== 15)
  ) 
  {
    errors.push("GST number must be a 15-character string.");
  }
  return errors;
};

exports.validateId=(id)=>
{
    if(!id || id.trim() === "" || isNaN(id))
    {
        let error={message: "Valid Id is required"};
        return error;
    }
    return null;
};